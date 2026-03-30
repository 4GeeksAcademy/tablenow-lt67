from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import DateTime, Float, String, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone

db = SQLAlchemy()
class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {"id": self.id, "email": self.email}

class Gerente(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    lastname: Mapped[str] = mapped_column(String(100))
    phone: Mapped[str] = mapped_column(String(20))
    email: Mapped[str] = mapped_column(String(120), unique=True)
    password: Mapped[str] = mapped_column(String(100))
    date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id, "name": self.name, "lastname": self.lastname,
            "phone": self.phone, "email": self.email,
            "date": self.date.isoformat() if self.date else None
        }

class Clients(db.Model):
    __tablename__ = "clients"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)

    def __repr__(self): return f"{self.name}"
    def serialize(self):
        return {"id": self.id, "name": self.name, "email": self.email, "phone": self.phone}

class Owner(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {"id": self.id, "name": self.name, "email": self.email, "phone": self.phone}

class Restaurante(db.Model):
    __tablename__ = "restaurante"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    menus = db.relationship("Menu", backref="restaurante", lazy=True, cascade="all, delete-orphan")

    def __repr__(self): return f'<Restaurante: {self.nombre}>'
    def serialize(self): return {"id": self.id, "nombre": self.nombre}

# --- TU RAMA 8: MENÚ ---
class Menu(db.Model):
    __tablename__ = "menu"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    categoria: Mapped[str] = mapped_column(String(80))
    precio: Mapped[float] = mapped_column(db.Float, nullable=False)
    disponible: Mapped[bool] = mapped_column(Boolean(), default=True)
    restaurante_id: Mapped[int] = mapped_column(db.ForeignKey("restaurante.id", ondelete="CASCADE"))

    def serialize(self):
        return {
            "id": self.id, "nombre": self.nombre, "categoria": self.categoria,
            "precio": self.precio, "disponible": self.disponible,
            "restaurante_id": self.restaurante_id
        }

class Venta(db.Model):
    __tablename__ = "venta"
    id: Mapped[int] = mapped_column(primary_key=True)
    cliente: Mapped[str] = mapped_column(String(120), nullable=False)
    total: Mapped[float] = mapped_column(db.Float, default=0.0)
    fecha: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    items = db.relationship("ItemVenta", backref="venta", lazy=True, cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id, "cliente": self.cliente, "total": self.total,
            "fecha": self.fecha.isoformat(),
            "items": [item.serialize() for item in self.items]
        }

class ItemVenta(db.Model):
    __tablename__ = "item_venta"
    id: Mapped[int] = mapped_column(primary_key=True)
    venta_id: Mapped[int] = mapped_column(ForeignKey("venta.id"))
    menu_id: Mapped[int] = mapped_column(ForeignKey("menu.id"))
    cantidad: Mapped[int] = mapped_column(nullable=False)
    precio_unitario: Mapped[float] = mapped_column(db.Float, nullable=False)
    
    plato = db.relationship("Menu")

    def serialize(self):
        return {
            "id": self.id, "venta_id": self.venta_id, "menu_id": self.menu_id,
            "cantidad": self.cantidad, "precio_unitario": self.precio_unitario,
            "nombre_plato": self.plato.nombre if self.plato else "Plato eliminado"
        }