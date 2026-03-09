from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker

from src.core.config import settings

engine = create_engine(settings.database_url, future=True, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)


@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):  # noqa: ARG001
    if engine.dialect.name == "sqlite":
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
