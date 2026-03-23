import os
import inspect
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_admin.theme import Bootstrap4Theme

from api.models import db
from api import models


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')

    admin = Admin(
        app,
        name='Admin Panel',
        theme=Bootstrap4Theme(swatch='cerulean')
    )

    for name, obj in inspect.getmembers(models):
        if inspect.isclass(obj) and issubclass(obj, db.Model):
            admin.add_view(ModelView(obj, db.session))