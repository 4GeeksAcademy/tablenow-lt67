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
    __tablename__ = "clients"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)

    def __repr__(self):
        return f"{self.name}"

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
    
    reserva_id: Mapped[int] = mapped_column(db.ForeignKey('reserva.id'), nullable=False)
    restaurante_id: Mapped[int] = mapped_column(db.ForeignKey('restaurante.id'), nullable=False)

    reserva = db.relationship("Reserva")
    restaurante = db.relationship("Restaurante")

    def __init__(self, total, payment_method, status, reserva_id, restaurante_id):
        self.total = total
        self.payment_method = payment_method.strip().lower() if payment_method else ""
        self.status = status.strip().lower() if status else "pending"
        self.reserva_id = reserva_id
        self.restaurante_id = restaurante_id

    def __repr__(self):
        try:
            nombre_cliente = self.reserva.cliente.name
            return f"Venta #{self.id} - {nombre_cliente}"
        except:
            return f"Venta #{self.id}"

    def serialize(self):
        return {
            "id": self.id,
            "date": self.date.isoformat(),
            "total": self.total,
            "payment_method": self.payment_method,
            "status": self.status,
            "reserva_id": self.reserva_id,
            "restaurante_id": self.restaurante_id,
            # AGREGA ESTAS LÍNEAS:
            "cliente_nombre": self.reserva.cliente.name if self.reserva and self.reserva.cliente else "N/A",
            "restaurante_nombre": self.restaurante.nombre if self.restaurante else "N/A"
        }

class Restaurante(db.Model):
    __tablename__ = "restaurante"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    menus = db.relationship("Menu", backref="restaurante", lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"{self.nombre}" 
    def serialize(self):
        return {"id": self.id, "nombre": self.nombre}

class Menu(db.Model):
    __tablename__ = "menu"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    categoria: Mapped[str] = mapped_column(String(80))
    precio: Mapped[float] = mapped_column(db.Float, nullable=False)
    disponible: Mapped[bool] = mapped_column(Boolean(), default=True)
    restaurante_id: Mapped[int] = mapped_column(db.ForeignKey("restaurante.id", ondelete="CASCADE"))

    def __repr__(self):
        return f"{self.nombre}"

    def serialize(self):
        return {
       "id": self.id,
            "nombre": self.nombre,
            "precio": self.precio,
            "restaurante_id": self.restaurante_id
    }

class Reserva(db.Model):
    __tablename__ = "reserva"
    id: Mapped[int] = mapped_column(primary_key=True)
    fecha: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    
    cliente_id: Mapped[int] = mapped_column(db.ForeignKey('clients.id'), nullable=False)
    restaurante_id: Mapped[int] = mapped_column(db.ForeignKey('restaurante.id'), nullable=False)

    cliente = db.relationship("Clients")
    restaurante = db.relationship("Restaurante")

    def __repr__(self):
        cliente_nombre = self.cliente.name if self.cliente else "N/A"
        return f"Reserva de {cliente_nombre} (ID {self.id})"

    def serialize(self):
        return {
            "id": self.id,
            "fecha": self.fecha.isoformat(),
            "cliente_id": self.cliente_id,
            "cliente_nombre": self.cliente.name if self.cliente else "Sin Nombre",
            "restaurante_id": self.restaurante_id
        }
    
class ItemVenta(db.Model):
    __tablename__ = "item_venta"
    id: Mapped[int] = mapped_column(primary_key=True)
    
    id_venta: Mapped[int] = mapped_column(db.ForeignKey('sale.id', ondelete="CASCADE"), nullable=False)
    id_menu: Mapped[int] = mapped_column(db.ForeignKey('menu.id', ondelete="CASCADE"), nullable=False)
    
    cantidad: Mapped[int] = mapped_column(db.Integer, nullable=False)
    precio_unitario: Mapped[float] = mapped_column(db.Float, nullable=False)
    subtotal: Mapped[float] = mapped_column(db.Float, nullable=False)

    sale = db.relationship("Sale")
    menu = db.relationship("Menu")

    def serialize(self):
        return {
            "id": self.id,
            "id_venta": self.id_venta,
            "id_menu": self.id_menu,
            "plato_nombre": self.menu.nombre if self.menu else "N/A",
            "cantidad": self.cantidad,
            "precio_unitario": self.precio_unitario,
            "subtotal": self.subtotal
        }