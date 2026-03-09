import re
from pathlib import Path

from src.main import create_app


def _extract_paths_from_openapi_yaml(openapi_path: Path) -> set[str]:
    content = openapi_path.read_text(encoding="utf-8")
    in_paths = False
    paths: set[str] = set()

    for line in content.splitlines():
        if line.strip() == "paths:":
            in_paths = True
            continue

        if in_paths and line and not line.startswith(" "):
            break

        if in_paths:
            match = re.match(r"^\s{2}(/[^:]+):\s*$", line)
            if match:
                paths.add(match.group(1))

    return paths


def test_openapi_paths_match_runtime_app():
    app = create_app()
    runtime_paths = set(app.openapi()["paths"].keys())
    docs_paths = _extract_paths_from_openapi_yaml(Path("docs/openapi.yaml"))

    required_paths = {"/links", "/{short_code}", "/links/{id}/stats", "/links/{id}"}
    assert required_paths.issubset(docs_paths)
    assert required_paths.issubset(runtime_paths)
    assert docs_paths.issubset(runtime_paths)


def test_openapi_required_status_codes():
    app = create_app()
    runtime = app.openapi()["paths"]

    assert set(runtime["/links"]["post"].get("responses", {}).keys()) >= {"201", "422"}
    assert set(runtime["/{short_code}"]["get"].get("responses", {}).keys()) >= {"302", "404"}
    assert set(runtime["/links/{id}"]["put"].get("responses", {}).keys()) >= {"200", "404", "422"}
    assert set(runtime["/links/{id}"]["delete"].get("responses", {}).keys()) >= {"200", "404"}
    assert set(runtime["/links/{id}/stats"]["get"].get("responses", {}).keys()) >= {
        "200",
        "404",
    }
