import re

from sqlalchemy.orm import DeclarativeBase, declared_attr

from src.core.config import settings


def _camel_to_snake(name: str) -> str:
    """Converts CamelCase to snake_case."""
    return re.sub(r'(?<!^)(?=[A-Z])', '_', name).lower()


class Base(DeclarativeBase):
    """
    Standard Base for all YES Links models.
    Automatically applies DB_TABLE_PREFIX to all table names.
    Example: 'Link' model becomes 'yes_links_links' if prefix is 'yes_links'.
    """
    @declared_attr.directive
    def __tablename__(cls) -> str:
        # Convert class name to plural snake_case
        name = _camel_to_snake(cls.__name__)
        if not name.endswith('s'):
            name += 's'

        prefix = settings.db_table_prefix.rstrip("_")
        return f"{prefix}_{name}" if prefix else name
