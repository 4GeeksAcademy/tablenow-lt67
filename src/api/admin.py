import os
from flask_admin import Admin
from flask_admin.theme import Bootstrap4Theme
from api.models import db, User, Gerente, Clients, Owner, Restaurante, Menu, Venta, ItemVenta, Reserva, Empleado
from flask_admin.contrib.sqla import ModelView
from wtforms.validators import DataRequired 

class RestauranteModelView(ModelView):
    form_args = {
        'owner_id': {
            'validators': [DataRequired()]
        }
    }
    column_list = ['id', 'nombre', 'owner_id'] 
    column_labels = {'owner_id': 'ID del Dueño'}

class ReservaModelView(ModelView):
    column_list = ['id', 'fecha', 'cliente', 'restaurante']
    column_formatters = {
        'cliente': lambda v, c, m, p: m.cliente.name if m.cliente else "Sin Nombre"
    }

class VentaModelView(ModelView):
    column_list = ['id', 'total', 'payment_method', 'status', 'restaurante']

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    admin = Admin(app, name='TableNow Admin', theme=Bootstrap4Theme(swatch='cerulean'))

    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Gerente, db.session))
    admin.add_view(ModelView(Clients, db.session))
    admin.add_view(ModelView(Owner, db.session))
    
    admin.add_view(RestauranteModelView(Restaurante, db.session)) 
    
    admin.add_view(ModelView(Menu, db.session))
    admin.add_view(VentaModelView(Venta, db.session))
    admin.add_view(ModelView(ItemVenta, db.session))
    admin.add_view(ReservaModelView(Reserva, db.session))

    admin.add_view(ModelView(Empleado, db.session))