"""merge heads

Revision ID: baf14a199a69
Revises: 3162e83e485f, remove_store_fields
Create Date: 2025-07-24 03:56:18.396135

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.engine.reflection import Inspector
from langflow.utils import migration


# revision identifiers, used by Alembic.
revision: str = 'baf14a199a69'
down_revision: Union[str, None] = ('3162e83e485f', 'remove_store_fields')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    pass


def downgrade() -> None:
    conn = op.get_bind()
    pass
