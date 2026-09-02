import os

from sqlalchemy import inspect, text

from database import engine


DEFAULT_ADMIN_NICKNAMES = "스탭입니다"


def get_admin_nicknames() -> list[str]:
    raw_admin_nicknames = os.getenv("ADMIN_NICKNAMES", DEFAULT_ADMIN_NICKNAMES)

    return [
        nickname.strip()
        for nickname in raw_admin_nicknames.split(",")
        if nickname.strip()
    ]


def ensure_column(table_name: str, column_name: str, ddl: str) -> None:
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())

    if table_name not in existing_tables:
        return

    existing_columns = {
        column["name"]
        for column in inspector.get_columns(table_name)
    }

    if column_name in existing_columns:
        return

    with engine.begin() as connection:
        connection.execute(text(ddl))


def relax_post_font_constraint() -> None:
    if engine.dialect.name != "postgresql":
        return

    inspector = inspect(engine)

    if "posts" not in set(inspector.get_table_names()):
        return

    with engine.begin() as connection:
        connection.execute(text("ALTER TABLE posts ALTER COLUMN font_id DROP NOT NULL"))


def assign_admin_roles() -> None:
    admin_nicknames = get_admin_nicknames()

    if not admin_nicknames:
        return

    placeholders = ", ".join(
        f":nickname_{index}"
        for index, _ in enumerate(admin_nicknames)
    )
    params = {
        f"nickname_{index}": nickname
        for index, nickname in enumerate(admin_nicknames)
    }

    with engine.begin() as connection:
        connection.execute(
            text(
                f"UPDATE users SET role = 'admin' "
                f"WHERE nickname IN ({placeholders})"
            ),
            params,
        )


def ensure_notice_schema() -> None:
    ensure_column(
        "users",
        "role",
        "ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user'",
    )
    ensure_column(
        "posts",
        "post_type",
        "ALTER TABLE posts ADD COLUMN post_type VARCHAR(20) NOT NULL DEFAULT 'post'",
    )
    relax_post_font_constraint()
    assign_admin_roles()
