from src.models.click import Click
from src.models.link import Link
from src.models.naming import table_name


def test_tables_use_prefix_namespace():
    assert Link.__tablename__ == table_name("links")
    assert Click.__tablename__ == table_name("clicks")


def test_click_fk_points_to_namespaced_links_table():
    foreign_keys = list(Click.__table__.c.link_id.foreign_keys)
    assert len(foreign_keys) == 1
    assert foreign_keys[0].target_fullname == f"{table_name('links')}.id"
