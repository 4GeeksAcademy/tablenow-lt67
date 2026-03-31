import os
from flask_admin import Admin
from flask_admin.theme import Bootstrap4Theme
from api.models import db, User, Gerente, Clients, Owner, Restaurante, Menu, Venta, ItemVenta
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    admin = Admin(app, name='TableNow Admin', theme=Bootstrap4Theme(swatch='cerulean'))

    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Gerente, db.session))
    admin.add_view(ModelView(Clients, db.session))
    admin.add_view(ModelView(Owner, db.session))
    admin.add_view(ModelView(Restaurante, db.session)) 
    admin.add_view(ModelView(Menu, db.session))
    admin.add_view(ModelView(Venta, db.session))
    admin.add_view(ModelView(ItemVenta, db.session))

   