import os
from flask_admin import Admin
from flask_admin.theme import Bootstrap4Theme
from api.models import db, User, Gerente, Clients, Owner, Restaurante, Menu, Reserva, Sale, ItemVenta
from flask_admin.contrib.sqla import ModelView

class ReservaModelView(ModelView):
    column_list = ['id', 'fecha', 'cliente', 'restaurante']
    form_columns = ['fecha', 'cliente', 'restaurante']

    column_formatters = {
        'cliente': lambda v, c, m, p: m.cliente.name if m.cliente else "Sin Nombre"
    }

class SaleModelView(ModelView):
    column_list = ['id', 'total', 'payment_method', 'status', 'reserva', 'restaurante']
    form_columns = ['total', 'payment_method', 'status', 'reserva', 'restaurante']
    
    form_args = {
        'reserva': {
            'label': 'Reserva del Cliente',
            'get_label': lambda m: f"CLIENTE: {m.cliente.name if m.cliente else 'N/A'} - ID: {m.id}"
        },
        'restaurante': {
            'label': 'Restaurante Seleccionado',
            'get_label': lambda m: f"REST: {m.nombre}"
        }
    }

class ItemVentaModelView(ModelView):
    column_list = ['id', 'id_venta', 'menu', 'cantidad', 'precio_unitario', 'subtotal']
    # Esto hará que en el admin veas el nombre del plato en vez del ID
    column_formatters = {
        'menu': lambda v, c, m, p: m.menu.nombre if m.menu else "N/A"
    }

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    admin = Admin(app, name='4Geeks Admin', theme=Bootstrap4Theme(swatch='cerulean'))
    
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Gerente, db.session))
    admin.add_view(ModelView(Clients, db.session))
    admin.add_view(ModelView(Owner, db.session))
    admin.add_view(ModelView(Menu, db.session))
    admin.add_view(ModelView(Restaurante, db.session)) 
    admin.add_view(ReservaModelView(Reserva, db.session)) 
    admin.add_view(SaleModelView(Sale, db.session))
    admin.add_view(ItemVentaModelView(ItemVenta, db.session))