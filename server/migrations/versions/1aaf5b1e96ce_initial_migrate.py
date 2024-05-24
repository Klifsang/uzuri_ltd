"""initial migrate

Revision ID: 1aaf5b1e96ce
Revises: 
Create Date: 2024-05-24 12:26:39.032270

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1aaf5b1e96ce'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('categories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('category_name', sa.String(), nullable=False),
    sa.Column('cat_surveyfee', sa.Integer(), nullable=False),
    sa.Column('cat_localfee', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('depth_height_costs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('min_depth_height', sa.Integer(), nullable=False),
    sa.Column('max_depth_height', sa.Integer(), nullable=False),
    sa.Column('cost_per_meter', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('invoices',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('client_id', sa.Integer(), nullable=False),
    sa.Column('client_name', sa.String(length=255), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('client_category', sa.String(length=255), nullable=False),
    sa.Column('invoice_number', sa.Integer(), nullable=False),
    sa.Column('date', sa.Date(), nullable=False),
    sa.Column('project_status', sa.String(length=255), nullable=False),
    sa.Column('drilling_name', sa.String(length=255), nullable=False),
    sa.Column('pump_name', sa.String(length=255), nullable=False),
    sa.Column('pipe_name', sa.String(length=255), nullable=False),
    sa.Column('pipe_diameter', sa.Integer(), nullable=False),
    sa.Column('pipe_length', sa.Integer(), nullable=False),
    sa.Column('number_of_outlets', sa.Integer(), nullable=False),
    sa.Column('tank_capacity', sa.Integer(), nullable=False),
    sa.Column('total_cost_before_tax', sa.Integer(), nullable=False),
    sa.Column('tax_amount', sa.Integer(), nullable=False),
    sa.Column('total_cost_after_tax', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('pipes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('pipe_name', sa.String(), nullable=False),
    sa.Column('pipe_cost', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('pumps',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('pump_name', sa.String(), nullable=False),
    sa.Column('cost', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('services',
    sa.Column('service_id', sa.Integer(), nullable=False),
    sa.Column('service_name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('service_id')
    )
    op.create_table('tokenblocklist',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('jti', sa.String(length=36), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('tokenblocklist', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_tokenblocklist_jti'), ['jti'], unique=False)

    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=100), nullable=False),
    sa.Column('email', sa.String(length=100), nullable=False),
    sa.Column('password', sa.String(length=100), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username')
    )
    op.create_table('clients',
    sa.Column('client_id', sa.Integer(), nullable=False),
    sa.Column('firstName', sa.String(), nullable=False),
    sa.Column('lastName', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('address', sa.String(), nullable=False),
    sa.Column('phone_number', sa.String(), nullable=False),
    sa.Column('location', sa.String(), nullable=False),
    sa.Column('category_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['category_id'], ['categories.id'], name=op.f('fk_clients_category_id_categories')),
    sa.PrimaryKeyConstraint('client_id'),
    sa.UniqueConstraint('email', name='uq_email')
    )
    op.create_table('drillingservices',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('drill_type', sa.String(), nullable=False),
    sa.Column('downpayment', sa.Integer(), nullable=False),
    sa.Column('service_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['service_id'], ['services.service_id'], name=op.f('fk_drillingservices_service_id_services')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('plumbingservices',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('pipe_type', sa.String(), nullable=False),
    sa.Column('type_cost', sa.String(), nullable=False),
    sa.Column('pipe_diameter', sa.Integer(), nullable=False),
    sa.Column('pipe_length', sa.Integer(), nullable=False),
    sa.Column('outlets', sa.Integer(), nullable=False),
    sa.Column('plumbing_cost', sa.Integer(), nullable=False),
    sa.Column('service_id', sa.Integer(), nullable=True),
    sa.Column('pipe_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['pipe_id'], ['pipes.id'], name=op.f('fk_plumbingservices_pipe_id_pipes')),
    sa.ForeignKeyConstraint(['service_id'], ['services.service_id'], name=op.f('fk_plumbingservices_service_id_services')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('pumpservices',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('depth', sa.Integer(), nullable=False),
    sa.Column('height', sa.Integer(), nullable=False),
    sa.Column('pump_cost', sa.Integer(), nullable=False),
    sa.Column('service_id', sa.Integer(), nullable=True),
    sa.Column('pump_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['pump_id'], ['pumps.id'], name=op.f('fk_pumpservices_pump_id_pumps')),
    sa.ForeignKeyConstraint(['service_id'], ['services.service_id'], name=op.f('fk_pumpservices_service_id_services')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('tanks',
    sa.Column('tank_id', sa.Integer(), nullable=False),
    sa.Column('tank_name', sa.Integer(), nullable=False),
    sa.Column('capacity', sa.Integer(), nullable=False),
    sa.Column('Tank_cost', sa.Integer(), nullable=False),
    sa.Column('service_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['service_id'], ['services.service_id'], name=op.f('fk_tanks_service_id_services')),
    sa.PrimaryKeyConstraint('tank_id')
    )
    op.create_table('clientservices',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('client_id', sa.Integer(), nullable=False),
    sa.Column('service_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['client_id'], ['clients.client_id'], name=op.f('fk_clientservices_client_id_clients')),
    sa.ForeignKeyConstraint(['service_id'], ['services.service_id'], name=op.f('fk_clientservices_service_id_services')),
    sa.PrimaryKeyConstraint('id', 'client_id', 'service_id')
    )
    op.create_table('fees',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('client_Id', sa.Integer(), nullable=True),
    sa.Column('drilling_id', sa.Integer(), nullable=True),
    sa.Column('drilling_downpayment', sa.Integer(), nullable=False),
    sa.Column('pump_depth', sa.Integer(), nullable=False),
    sa.Column('pump_height', sa.Integer(), nullable=False),
    sa.Column('pump_cost', sa.Integer(), nullable=False),
    sa.Column('pump_id', sa.Integer(), nullable=True),
    sa.Column('pumptype_cost', sa.Integer(), nullable=False),
    sa.Column('pipe_diameter', sa.Integer(), nullable=False),
    sa.Column('pipe_length', sa.Integer(), nullable=False),
    sa.Column('number_of_outlets', sa.Integer(), nullable=False),
    sa.Column('plumbing_cost', sa.Integer(), nullable=False),
    sa.Column('pipe_id', sa.Integer(), nullable=True),
    sa.Column('pipe_cost', sa.Integer(), nullable=False),
    sa.Column('tank_capacity', sa.Integer(), nullable=False),
    sa.Column('tank_cost', sa.Integer(), nullable=False),
    sa.Column('total_cost', sa.Integer(), nullable=False),
    sa.Column('tax_amount', sa.Integer(), nullable=False),
    sa.Column('local_fee', sa.Integer(), nullable=False),
    sa.Column('survey_fee', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['client_Id'], ['clients.client_id'], name=op.f('fk_fees_client_Id_clients')),
    sa.ForeignKeyConstraint(['drilling_id'], ['drillingservices.id'], name=op.f('fk_fees_drilling_id_drillingservices')),
    sa.ForeignKeyConstraint(['pipe_id'], ['pipes.id'], name=op.f('fk_fees_pipe_id_pipes')),
    sa.ForeignKeyConstraint(['pump_id'], ['pumps.id'], name=op.f('fk_fees_pump_id_pumps')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('fees')
    op.drop_table('clientservices')
    op.drop_table('tanks')
    op.drop_table('pumpservices')
    op.drop_table('plumbingservices')
    op.drop_table('drillingservices')
    op.drop_table('clients')
    op.drop_table('users')
    with op.batch_alter_table('tokenblocklist', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_tokenblocklist_jti'))

    op.drop_table('tokenblocklist')
    op.drop_table('services')
    op.drop_table('pumps')
    op.drop_table('pipes')
    op.drop_table('invoices')
    op.drop_table('depth_height_costs')
    op.drop_table('categories')
    # ### end Alembic commands ###