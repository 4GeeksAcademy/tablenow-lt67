import os
import sys
sys.path.append(os.path.join(os.getcwd(), 'src'))

from app import app
from api.models import db
from sqlalchemy import text

with app.app_context():
    try:
        print("Limpiando tablas con dependencias...")
        # Usamos CASCADE para que borre las relaciones automáticamente
        db.session.execute(text("DROP TABLE IF EXISTS item_venta CASCADE"))
        db.session.execute(text("DROP TABLE IF EXISTS venta CASCADE"))
        db.session.execute(text("DROP TABLE IF EXISTS sale CASCADE"))
        db.session.execute(text("DROP TABLE IF EXISTS reserva CASCADE"))
        db.session.execute(text("DROP TABLE IF EXISTS alembic_version CASCADE"))
        
        db.session.commit() # <--- MUY IMPORTANTE PARA GUARDAR LOS BORRADOS
        print("✅ ¡Tablas conflictivas borradas! El camino está despejado.")
    except Exception as e:
        print(f"❌ Error: {e}")