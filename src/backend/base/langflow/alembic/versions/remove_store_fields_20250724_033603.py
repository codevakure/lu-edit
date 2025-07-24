"""Remove store fields

Revision ID: remove_store_fields
Revises: dd9e0804ebd1
Create Date: 2025-07-24T03:36:03.447545

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "remove_store_fields"
down_revision = "dd9e0804ebd1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Remove store_api_key column from user table
    try:
        op.drop_column('user', 'store_api_key')
    except Exception:
        pass  # Column might not exist


def downgrade() -> None:
    # Add back store_api_key column to user table
    op.add_column('user', sa.Column('store_api_key', sa.String(), nullable=True))
