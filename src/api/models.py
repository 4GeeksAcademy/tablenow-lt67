from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import DateTime, Float, String, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
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
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)

    def __repr__(self): return f"{self.name}"

    def serialize(self):
        return {"id": self.id, "name": self.name, "email": self.email, "phone": self.phone}


class Owner(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {"id": self.id, "name": self.name, "email": self.email, "phone": self.phone}


class Restaurante(db.Model):
    __tablename__ = "restaurante"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    direccion: Mapped[str] = mapped_column(String(250), nullable=True) # Nueva
    telefono: Mapped[str] = mapped_column(String(20), nullable=True)    # Nueva
    capacidad_total: Mapped[int] = mapped_column(db.Integer, nullable=True) # Nueva
    owner_id: Mapped[int] = mapped_column(db.ForeignKey("owner.id"), nullable=False)
    
    owner = db.relationship("Owner", backref="restaurantes")
    
    menus = db.relationship("Menu", backref="restaurante", lazy=True, cascade="all, delete-orphan")
    reservas = db.relationship("Reserva", backref="restaurante", lazy=True, cascade="all, delete-orphan") # Nueva conexión
    
    def __repr__(self): return f'<Restaurante: {self.nombre}>'

    def serialize(self): 
        return {
            "id": self.id, 
            "nombre": self.nombre,
            "direccion": self.direccion,
            "telefono": self.telefono,
            "capacidad_total": self.capacidad_total,
            "owner_id": self.owner_id
        }



class Menu(db.Model):
    __tablename__ = "menu"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    categoria: Mapped[str] = mapped_column(String(80))
    precio: Mapped[float] = mapped_column(db.Float, nullable=False)
    disponible: Mapped[bool] = mapped_column(Boolean(), default=True)
    restaurante_id: Mapped[int] = mapped_column(
        db.ForeignKey("restaurante.id", ondelete="CASCADE"))
    def __repr__(self):
        return f"{self.nombre}"
    def serialize(self):
        return {
            "id": self.id, "nombre": self.nombre, "categoria": self.categoria,
            "precio": self.precio, "disponible": self.disponible,
            "restaurante_id": self.restaurante_id
        }

class Venta(db.Model):
    __tablename__ = "venta"
    
    id = db.Column(db.Integer, primary_key=True)
    total = db.Column(db.Float, default=0.0)
    
    fecha = db.Column(db.DateTime, default=datetime.now) 
    
    payment_method = db.Column(db.String(50), default="not_set")
    status = db.Column(db.String(50), default="pending")
    
    items = db.relationship('ItemVenta', backref='venta', cascade="all, delete-orphan")
    
    restaurante_id = db.Column(db.Integer, db.ForeignKey('restaurante.id'), nullable=True)
    restaurante = db.relationship("Restaurante")

    cliente_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=True)
    cliente = db.relationship("Clients")

    def __repr__(self):
        return f"<Venta {self.id} - Total: {self.total}>"

    def serialize(self):
        return {
            "id": self.id, 
            "total": self.total,
            "payment_method": self.payment_method,
            "status": self.status,
            "customer_name": self.cliente.name if self.cliente else None,
            "date": self.fecha.isoformat() if self.fecha else "No Date",
            "restaurante_nombre": self.restaurante.nombre if self.restaurante else "TableNow Central"
        }


class ItemVenta(db.Model):
    __tablename__ = "item_venta"
    id: Mapped[int] = mapped_column(primary_key=True)
    venta_id: Mapped[int] = mapped_column(ForeignKey("venta.id", ondelete="CASCADE"))
    menu_id: Mapped[int] = mapped_column(ForeignKey("menu.id", ondelete="CASCADE"))
    cantidad: Mapped[int] = mapped_column(nullable=False)
    precio_unitario: Mapped[float] = mapped_column(db.Float, nullable=False)

    plato = db.relationship("Menu")

    def serialize(self):
        return {
        "id": self.id,
        "id_venta": self.venta_id,
        "id_menu": self.menu_id,
        "cantidad": self.cantidad,
        "precio_unitario": float(self.precio_unitario),
        "subtotal": float(self.cantidad * self.precio_unitario),
        "plato_nombre": self.plato.nombre if self.plato else "Plato desconocido"
    }


class Reserva(db.Model):
    __tablename__ = "reserva"
    id: Mapped[int] = mapped_column(primary_key=True)
    
    cliente_id: Mapped[int] = mapped_column(db.ForeignKey('clients.id'), nullable=False) 
    restaurante_id: Mapped[int] = mapped_column(db.ForeignKey("restaurante.id"), nullable=False)
    id_mesa: Mapped[int] = mapped_column(db.Integer, nullable=True) # El número de mesa del Excel
    
    fecha: Mapped[str] = mapped_column(String(20), nullable=False) # 2026-03-20
    hora: Mapped[str] = mapped_column(String(10), nullable=False)  # 19:00
    num_personas: Mapped[int] = mapped_column(db.Integer, nullable=False)
    
    estado: Mapped[str] = mapped_column(String(50), default="pendiente") # confirmada, cancelada
    origen: Mapped[str] = mapped_column(String(50), default="online") # online, telefono
    notas: Mapped[str] = mapped_column(String(250), nullable=True)
    fecha_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    cliente = db.relationship("Clients")

    def __repr__(self):
        return f"Reserva #{self.id} - Cliente ID: {self.cliente_id} - Mesa: {self.id_mesa}"

    def serialize(self):
        return {
        "id": self.id,
        "id_mesa": self.id_mesa,
        "fecha": self.fecha,
        "hora": self.hora,
        "num_personas": self.num_personas,
        "estado": self.estado,
        "origen": self.origen,
        "notas": self.notas,
        "id_restaurante": self.restaurante_id,
        "nombre_restaurante": self.restaurante.nombre if self.restaurante else "No asignado",
        "cliente": {
            "id": self.cliente.id,
            "name": self.cliente.name,
            "email": self.cliente.email,
            "phone": self.cliente.phone
        } if self.cliente else None
    }

class Empleado(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    phone: Mapped[str] = mapped_column(String(120), nullable=False)
    rol: Mapped[str] = mapped_column(String(40), nullable=False)
    state: Mapped[str] = mapped_column(String(30), nullable=True)
    

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "phone": self.phone,
            "rol": self.rol,
            "state": self.state
           
        }