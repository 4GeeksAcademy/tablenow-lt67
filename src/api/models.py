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
        return {
            "id": self.id,
            "email": self.email,
        }


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
            "id": self.id,
            "name": self.name,
            "lastname": self.lastname,
            "phone": self.phone,
            "email": self.email,
            "date": self.date.isoformat() if self.date else None
        }


class Clients(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone
        }


class Owner(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone
        }

class Sale(db.Model):
    __tablename__ = "sale"

    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    total: Mapped[float] = mapped_column(Float, nullable=False)
    payment_method: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="pending")

    # Eliminamos el ForeignKey temporalmente para que no de error
    booking_id: Mapped[int] = mapped_column(nullable=False)
    restaurant_id: Mapped[int] = mapped_column(nullable=False)

    def __init__(self, total, payment_method, status, booking_id, restaurant_id):
        self.total = total
        self.payment_method = payment_method.strip().lower() if payment_method else ""
        self.status = status.strip().lower() if status else "pending"
        self.booking_id = booking_id
        self.restaurant_id = restaurant_id

    def serialize(self):
        return {
            "id": self.id,
            "date": self.date.isoformat(),
            "total": self.total,
            "payment_method": self.payment_method,
            "status": self.status,
            "booking_id": self.booking_id,
            "restaurant_id": self.restaurant_id
        }


#menu y restaurante 

class Restaurante(db.Model):
    __tablename__ = "restaurante"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    
    # Esto permite que desde un restaurante veas sus platos: restaurante.menus
    menus = db.relationship("Menu", backref="restaurante", lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Restaurante: {self.nombre}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre
        }

class Menu(db.Model):
    __tablename__ = "menu"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    categoria: Mapped[str] = mapped_column(String(80))
    precio: Mapped[float] = mapped_column(db.Float, nullable=False)
    disponible: Mapped[bool] = mapped_column(Boolean(), default=True)
    
    # Relación con restaurante
    restaurante_id: Mapped[int] = mapped_column(db.ForeignKey("restaurante.id", ondelete="CASCADE"))

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "categoria": self.categoria,
            "precio": self.precio,
            "disponible": self.disponible,
            "restaurante_id": self.restaurante_id
        }