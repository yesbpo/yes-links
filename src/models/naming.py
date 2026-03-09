from src.core.config import settings


def table_name(base_name: str) -> str:
    prefix = settings.db_table_prefix.rstrip("_")
    return f"{prefix}_{base_name}" if prefix else base_name
