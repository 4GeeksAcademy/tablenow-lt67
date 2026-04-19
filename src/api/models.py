from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import DateTime, Float, String, ForeignKey, Boolean,Integer,Date
from sqlalchemy.orm import Mapped, mapped_column,relationship
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
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=True) 
    latitud: Mapped[str] = mapped_column(String(200), nullable=True)
    longitud: Mapped[str] = mapped_column(String(200), nullable=True)

    def __repr__(self): return f"{self.name}"

    def serialize(self):
        return {
            "id": self.id, 
            "name": self.name, 
            "email": self.email, 
            "phone": self.phone,
            "image_url": self.image_url,
            "latitud": self.latitud,   
            "longitud": self.longitud  
        }


class Owner(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    restaurantes: Mapped[list["Restaurante"]] = relationship(cascade="all, delete-orphan")

    def serialize(self):
        return {"id": self.id, "name": self.name, "email": self.email, "phone": self.phone}


class Restaurante(db.Model):
    __tablename__ = "restaurante"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    direccion: Mapped[str] = mapped_column(String(250), nullable=True)
    telefono: Mapped[str] = mapped_column(String(20), nullable=True)
    capacidad_total: Mapped[int] = mapped_column(db.Integer, nullable=True)
    owner_id: Mapped[int] = mapped_column(db.ForeignKey("owner.id"), nullable=False)
    image_url: Mapped[str] = mapped_column(String(500), nullable=True) 
    latitud: Mapped[str] = mapped_column(String(200), nullable=True)
    longitud: Mapped[str] = mapped_column(String(200), nullable=True)
    category: Mapped[str] = mapped_column(String(200), nullable=True, default="General")
    tags: Mapped[str] = mapped_column(String(500), nullable=True, default="Estándar")
    opening_time: Mapped[str] = mapped_column(String(10), nullable=True, default="09:00")
    closing_time: Mapped[str] = mapped_column(String(10), nullable=True, default="22:00")

    def serialize(self): 
        return {
            "id": self.id, 
            "nombre": self.nombre,
            "direccion": self.direccion,
            "telefono": self.telefono,
            "capacidad_total": self.capacidad_total,
            "owner_id": self.owner_id,
            "image_url": self.image_url, 
            "latitud": self.latitud,    
            "longitud": self.longitud,
            "category": self.category,
            "tags": self.tags,
            "opening_time": self.opening_time, 
            "closing_time": self.closing_time, 
            "count_hostess": 0,
            "count_tables": 0
        }

class Menu(db.Model):
    __tablename__ = "menu"
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    categoria: Mapped[str] = mapped_column(String(80))
    precio: Mapped[float] = mapped_column(db.Float, nullable=False)
    disponible: Mapped[bool] = mapped_column(Boolean(), default=True)
    foto: Mapped[str] = mapped_column(String(500), nullable=True) 
    descripcion: Mapped[str] = mapped_column(String(255), nullable=True)
    restaurante_id: Mapped[int] = mapped_column(
        db.ForeignKey("restaurante.id", ondelete="CASCADE"))

    def serialize(self):
        return {
            "id": self.id, 
            "nombre": self.nombre, 
            "categoria": self.categoria,
            "precio": self.precio, 
            "disponible": self.disponible,
            "foto": self.foto, 
            "descripcion": self.descripcion, 
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
    id_mesa: Mapped[int] = mapped_column(db.Integer, nullable=True) 
    
    fecha: Mapped[str] = mapped_column(String(20), nullable=False) 
    hora: Mapped[str] = mapped_column(String(10), nullable=False)  
    num_personas: Mapped[int] = mapped_column(db.Integer, nullable=False)
    
    estado: Mapped[str] = mapped_column(String(50), default="pendiente") 
    origen: Mapped[str] = mapped_column(String(50), default="online") 
    notas: Mapped[str] = mapped_column(String(250), nullable=True)
    fecha_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    cliente = db.relationship("Clients")
    restaurante = db.relationship("Restaurante")
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
            "restaurante_id": self.restaurante_id, 
            "nombre_restaurante": self.restaurante.nombre if self.restaurante else "No asignado",
            "cliente": {
                "id": self.cliente.id,
                "name": self.cliente.name,
                "email": self.cliente.email,
                "phone": self.cliente.phone
            } if self.cliente else None
        }
     
class Hostess(db.Model):
    __tablename__ = "hostess"
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(20), nullable=False)
    special_notes: Mapped[str] = mapped_column(String(500), nullable=True)
    
    total_visits: Mapped[int] = mapped_column(Integer, nullable=True, default=0)
    last_visit: Mapped[str] = mapped_column(String(50), nullable=True) 

    restaurante_id: Mapped[int] = mapped_column(db.ForeignKey("restaurante.id"), nullable=False)
    
    def __repr__(self):
        return f'<Hostess: {self.first_name} {self.last_name}>'

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "phone_number": self.phone_number,
            "special_notes": self.special_notes,
            "total_visits": self.total_visits,
            "last_visit": self.last_visit,
            "restaurante_id": self.restaurante_id
        }
    
class Table(db.Model):
    __tablename__ = "table"
    id: Mapped[int] = mapped_column(primary_key=True)
    table_number: Mapped[str] = mapped_column(String(50), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="available")
    
    restaurante_id: Mapped[int] = mapped_column(db.ForeignKey("restaurante.id"), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "table_number": self.table_number,
            "capacity": self.capacity,
            "status": self.status,
            "restaurante_id": self.restaurante_id
        }

class Waitlist(db.Model):
    __tablename__ = "waitlist"
    id: Mapped[int] = mapped_column(primary_key=True)
    
    client_id: Mapped[int] = mapped_column(db.ForeignKey("clients.id"), nullable=False)
    restaurant_id: Mapped[int] = mapped_column(db.ForeignKey("restaurante.id"), nullable=False)
    
    check_in_time: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    estimated_wait: Mapped[int] = mapped_column(Integer, nullable=True) # in minutes
    status: Mapped[str] = mapped_column(String(50), default="waiting") # waiting, seated, cancelled

    client = db.relationship("Clients")

    def serialize(self):
        return {
            "id": self.id,
            "client_name": self.client.name if self.client else "Unknown",
            "check_in_time": self.check_in_time.isoformat(),
            "estimated_wait": self.estimated_wait,
            "status": self.status,
            "restaurant_id": self.restaurant_id
        }
class Empleado(db.Model):
    __tablename__ = "empleado"
    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), nullable=False)
    phone: Mapped[str] = mapped_column(String(120), nullable=False)
    rol: Mapped[str] = mapped_column(String(40), nullable=False)
    state: Mapped[str] = mapped_column(String(30), nullable=True)
    password: Mapped[str] = mapped_column(String(120), nullable=False)

    def serialize(self):
        return {
        "id": self.id,
        "full_name": self.full_name,
        "email": self.email,
        "phone": self.phone,
        "rol": self.rol,
        "state": self.state
    }

class ChatMessage(db.Model):
    __tablename__ = "chat_message"
    id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column(String(500), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    sender_id: Mapped[int] = mapped_column(Integer, nullable=False)
    sender_type: Mapped[str] = mapped_column(String(50), nullable=False) 
    receiver_id: Mapped[int] = mapped_column(Integer, nullable=False)
    receiver_type: Mapped[str] = mapped_column(String(50), nullable=False) 
    restaurante_id: Mapped[int] = mapped_column(db.ForeignKey("restaurante.id"), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "timestamp": self.timestamp.isoformat(),
            "sender_id": self.sender_id,
            "sender_type": self.sender_type,
            "receiver_id": self.receiver_id,
            "receiver_type": self.receiver_type,
            "restaurante_id": self.restaurante_id
        }