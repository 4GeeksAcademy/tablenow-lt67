import os
import inspect
from flask_admin import Admin
from . import models
from .models import User, db, Gerente, Clients, Owner, Restaurant
from flask_admin.contrib.sqla import ModelView
from flask_admin.theme import Bootstrap4Theme

class RestaurantAdmin(ModelView):
    form_columns = ('owner', 'name', 'phone', 'total_capacity')

class OwnerAdmin(ModelView):
    form_columns = ('restaurant', 'name', 'email', 'phone', 'password', 'is_active')

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    admin = Admin(app, name='4Geeks Admin', theme=Bootstrap4Theme(swatch='cerulean'))

    admin.add_view(ModelView(Gerente, db.session))
    admin.add_view(ModelView(Clients, db.session))
    admin.add_view(OwnerAdmin(Owner, db.session))
    admin.add_view(RestaurantAdmin(Restaurant, db.session))
