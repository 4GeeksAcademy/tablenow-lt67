"""merge de ramas de migracion

Revision ID: 7351e0d3f813
Revises: 681a677183a1, f8dd51556afe
Create Date: 2026-03-26 22:38:02.626641

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7351e0d3f813'
down_revision = ('681a677183a1', 'f8dd51556afe')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
