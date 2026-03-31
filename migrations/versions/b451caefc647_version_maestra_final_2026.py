"""version maestra final 2026

Revision ID: b451caefc647
Revises: 
Create Date: 2026-03-31 20:50:07.031286

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'b451caefc647'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # 1. Reserva (Ahora sin comentar para que cree la columna 'fecha')
    op.create_table('reserva',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('fecha', sa.DateTime(), nullable=False),
        sa.Column('cliente_id', sa.Integer(), nullable=False),
        sa.Column('restaurante_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['cliente_id'], ['clients.id'], ), 
        sa.ForeignKeyConstraint(['restaurante_id'], ['restaurante.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # 2. Sale
    op.create_table('sale',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('date', sa.DateTime(), nullable=False),
        sa.Column('total', sa.Float(), nullable=False),
        sa.Column('payment_method', sa.String(length=50), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('reserva_id', sa.Integer(), nullable=False),
        sa.Column('restaurante_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['reserva_id'], ['reserva.id'], ),
        sa.ForeignKeyConstraint(['restaurante_id'], ['restaurante.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # 3. Item_Venta
    op.create_table('item_venta',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('id_venta', sa.Integer(), nullable=False),
        sa.Column('id_menu', sa.Integer(), nullable=False),
        sa.Column('cantidad', sa.Integer(), nullable=False),
        sa.Column('precio_unitario', sa.Float(), nullable=False),
        sa.Column('subtotal', sa.Float(), nullable=False),
        sa.ForeignKeyConstraint(['id_menu'], ['menu.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['id_venta'], ['sale.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('item_venta')
    op.drop_table('sale')
    op.drop_table('reserva')