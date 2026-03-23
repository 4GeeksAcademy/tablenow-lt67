from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

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


# ================= RESTAURANTE =================
class Restaurante(db.Model):
    __tablename__ = "restaurante"

    id_restaurante = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    direccion = db.Column(db.String(200))
    telefono = db.Column(db.String(20))
    capacidad_total = db.Column(db.Integer)

    mesas = db.relationship('Mesa', backref='restaurante', lazy=True)

    def serialize(self):
        return {
            "id": self.id_restaurante,
            "nombre": self.nombre,
            "direccion": self.direccion,
            "telefono": self.telefono,
            "capacidad_total": self.capacidad_total
        }


# ================= CLIENTE =================
class Cliente(db.Model):
    __tablename__ = "cliente"

    id_cliente = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100))
    apellido = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True)
    telefono = db.Column(db.String(20))

    def serialize(self):
        return {
            "id": self.id_cliente,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "email": self.email,
            "telefono": self.telefono
        }


# ================= MESA =================
class Mesa(db.Model):
    __tablename__ = "mesa"

    id_mesa = db.Column(db.Integer, primary_key=True)
    numero = db.Column(db.Integer)
    capacidad = db.Column(db.Integer)

    id_restaurante = db.Column(
        db.Integer,
        db.ForeignKey('restaurante.id_restaurante'),
        nullable=False
    )

    def serialize(self):
        return {
            "id": self.id_mesa,
            "numero": self.numero,
            "capacidad": self.capacidad,
            "id_restaurante": self.id_restaurante
        }


# ================= RESERVA =================
class Reserva(db.Model):
    __tablename__ = "reserva"

    id_reserva = db.Column(db.Integer, primary_key=True)

    id_cliente = db.Column(db.Integer, nullable=False)
    id_mesa = db.Column(db.Integer, nullable=False)
    id_restaurante = db.Column(db.Integer, nullable=False)

    fecha = db.Column(db.Date)
    hora = db.Column(db.Time)
    num_personas = db.Column(db.Integer)

    def serialize(self):
        return {
            "id": self.id_reserva,
            "id_cliente": self.id_cliente,
            "id_mesa": self.id_mesa,
            "id_restaurante": self.id_restaurante,
            "fecha": self.fecha.strftime("%Y-%m-%d") if self.fecha else None,
            "hora": self.hora.strftime("%H:%M") if self.hora else None,
            "num_personas": self.num_personas
        }


# ================= MENU =================
class Menu(db.Model):
    __tablename__ = "menu"

    id_plato = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100))
    precio = db.Column(db.Float)

    id_restaurante = db.Column(db.Integer, nullable=False)

    def serialize(self):
        return {
            "id": self.id_plato,
            "nombre": self.nombre,
            "precio": self.precio,
            "id_restaurante": self.id_restaurante
        }


# ================= VENTA =================
class Venta(db.Model):
    __tablename__ = "venta"

    id_venta = db.Column(db.Integer, primary_key=True)
    total = db.Column(db.Float, default=0)
    metodo_pago = db.Column(db.String(50))

    id_reserva = db.Column(db.Integer, nullable=False)

    def serialize(self):
        return {
            "id": self.id_venta,
            "total": self.total,
            "metodo_pago": self.metodo_pago,
            "id_reserva": self.id_reserva
        }


# ================= DETALLE VENTA =================
class DetalleVenta(db.Model):
    __tablename__ = "detalle_venta"

    id_detalle = db.Column(db.Integer, primary_key=True)
    id_venta = db.Column(db.Integer, nullable=False)
    id_plato = db.Column(db.Integer, nullable=False)
    cantidad = db.Column(db.Integer)
    subtotal = db.Column(db.Float)

    def serialize(self):
        return {
            "id": self.id_detalle,
            "id_venta": self.id_venta,
            "id_plato": self.id_plato,
            "cantidad": self.cantidad,
            "subtotal": self.subtotal
        }