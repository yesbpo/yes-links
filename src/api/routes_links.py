from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from src.api.schemas import (
    CreateLinkRequest,
    DeleteLinkResponse,
    LinkResponse,
    StatsResponse,
    UpdateLinkRequest,
)
from src.core.database import get_db
from src.core.metrics import click_events_total, redirect_errors_total, redirect_requests_total
from src.repositories.link_repository import LinkRepository
from src.services.analytics_service import AnalyticsService
from src.services.click_ingest_service import ClickIngestService
from src.services.events import emit_event
from src.services.link_resolver_service import LinkResolverService
from src.services.link_service import LinkService

router = APIRouter(tags=["links"])


def get_link_service() -> LinkService:
    return LinkService(LinkRepository())


def _to_link_response(link) -> LinkResponse:
    return LinkResponse(
        id=link.id,
        short_code=link.short_code,
        short_url=f"https://y3s.cc/{link.short_code}",
        target_url=link.target_url,
        campaign=link.campaign,
        tags=link.tags,
        created_at=link.created_at,
        created_by=link.created_by,
    )


@router.post("/links", response_model=LinkResponse, status_code=status.HTTP_201_CREATED)
def create_link(
    payload: CreateLinkRequest,
    request: Request,
    db: Session = Depends(get_db),
    service: LinkService = Depends(get_link_service),
):
    link = service.create(
        db,
        target_url=payload.target_url,
        campaign=payload.campaign,
        tags=payload.tags,
        created_by="api",
    )

    emit_event(
        request.app.state.logger,
        event_name="link.created.v1",
        payload={
            "request_id": getattr(request.state, "request_id", "-"),
            "route": "/links",
            "status_code": 201,
            "payload": {"link_id": link.id, "short_code": link.short_code},
        },
    )

    return _to_link_response(link)


@router.put(
    "/links/{id}",
    response_model=LinkResponse,
    responses={404: {"description": "Link not found"}},
)
def update_link(
    id: str,
    payload: UpdateLinkRequest,
    request: Request,
    db: Session = Depends(get_db),
    service: LinkService = Depends(get_link_service),
):
    link = service.update(
        db,
        link_id=id,
        target_url=payload.target_url,
        campaign=payload.campaign,
        tags=payload.tags,
    )

    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    LinkResolverService.invalidate_short_code(link.short_code)
    emit_event(
        request.app.state.logger,
        event_name="link.updated.v1",
        payload={
            "request_id": getattr(request.state, "request_id", "-"),
            "route": f"/links/{id}",
            "status_code": 200,
            "payload": {"link_id": link.id, "short_code": link.short_code},
        },
    )
    return _to_link_response(link)


@router.delete(
    "/links/{id}",
    response_model=DeleteLinkResponse,
    responses={404: {"description": "Link not found"}},
)
def delete_link(
    id: str,
    request: Request,
    db: Session = Depends(get_db),
    service: LinkService = Depends(get_link_service),
):
    link = service.delete(db, link_id=id)
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    LinkResolverService.invalidate_short_code(link.short_code)
    emit_event(
        request.app.state.logger,
        event_name="link.deleted.v1",
        payload={
            "request_id": getattr(request.state, "request_id", "-"),
            "route": f"/links/{id}",
            "status_code": 200,
            "payload": {"link_id": link.id, "short_code": link.short_code},
        },
    )
    return DeleteLinkResponse(id=link.id, deleted=True)


@router.get(
    "/links/{id}/stats",
    response_model=StatsResponse,
    responses={404: {"description": "Link not found"}},
)
def get_stats(id: str, db: Session = Depends(get_db)):
    link = LinkRepository.get_by_id(db, id)
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    stats = AnalyticsService.get_stats(db, id)
    return StatsResponse(**stats)


@router.get(
    "/{short_code}",
    status_code=status.HTTP_302_FOUND,
    responses={404: {"description": "Short code not found"}},
)
def redirect(
    short_code: str,
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    redirect_requests_total.inc()
    link = LinkResolverService.resolve_by_short_code(db, short_code)

    if not link:
        redirect_errors_total.inc()
        background_tasks.add_task(
            emit_event,
            request.app.state.logger,
            event_name="link.redirect_failed.v1",
            payload={
                "request_id": getattr(request.state, "request_id", "-"),
                "route": f"/{short_code}",
                "status_code": 404,
                "ip": request.client.host if request.client else None,
                "user_agent": request.headers.get("user-agent"),
            },
        )
        raise HTTPException(status_code=404, detail="Short code not found")

    # Ingest click and emit events in background
    background_tasks.add_task(
        _process_click_background,
        db=db,
        link=link,
        request=request,
    )

    return RedirectResponse(url=link.target_url, status_code=status.HTTP_302_FOUND)


def _process_click_background(db: Session, link, request: Request):
    click_result = ClickIngestService.record_click(
        db,
        link_id=link.id,
        ip=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        referrer=request.headers.get("referer"),
        geo={},
    )
    click_events_total.inc()

    logger = request.app.state.logger
    req_id = getattr(request.state, "request_id", "-")

    emit_event(
        logger,
        event_name="link.redirected.v1",
        payload={
            "request_id": req_id,
            "route": f"/{link.short_code}",
            "status_code": 302,
            "ip": click_result["payload"]["ip"],
            "user_agent": click_result["payload"]["user_agent"],
            "payload": {
                "link_id": link.id,
                "target_url": link.target_url,
                "ingest_mode": click_result["mode"],
            },
        },
    )

    emit_event(
        logger,
        event_name="link.click_logged.v1",
        payload={
            "request_id": req_id,
            "route": f"/{link.short_code}",
            "status_code": 302,
            "ip": click_result["payload"]["ip"],
            "user_agent": click_result["payload"]["user_agent"],
            "payload": {
                "click_id": click_result["click_id"],
                "link_id": link.id,
                "ingest_mode": click_result["mode"],
            },
        },
    )
