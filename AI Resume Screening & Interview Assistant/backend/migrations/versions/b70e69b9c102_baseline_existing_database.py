"""baseline existing database

Revision ID: b70e69b9c102
Revises: dd1ef35f5bac
Create Date: 2026-07-01 02:39:37.365579

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b70e69b9c102'
down_revision: Union[str, Sequence[str], None] = 'dd1ef35f5bac'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
