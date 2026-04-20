"""add endereco entrega to pedidos

Revision ID: 001_add_endereco_entrega
Revises: 
Create Date: 2026-04-20 11:26:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001_add_endereco_entrega'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Adiciona a coluna faltante na tabela pedidos
    op.add_column('pedidos', sa.Column('endereco_entrega', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('pedidos', 'endereco_entrega')
