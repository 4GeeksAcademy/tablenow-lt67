from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer
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
            # do not serialize the password, its a security breach
        }
    
class Host(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(20), nullable=False)
    last_name: Mapped[str] = mapped_column(String(20), nullable=False)
    phone_number: Mapped[bool] = mapped_column(String(20), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    special_notes: Mapped[str] = mapped_column(String(500), nullable=True)
    total_visits: Mapped[str] = mapped_column(Integer, nullable=False)
    last_visit: Mapped[str] = mapped_column(String(20), nullable=False)
    password: Mapped[str] = mapped_column(String(1000), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone_number": self.phone_number,
            "email": self.email,
            "special_notes": self.special_notes,
            "total_visits": self.total_visits,
            "last_visit": self.last_visit,

        }

class Table(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    table_number: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    capacity: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    status: Mapped[bool] = mapped_column(String(120), unique=True, nullable=False)

class Waitlist(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    customer_id: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    check_in_time: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    estimated_time: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    waiting_state: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)

class Reservation(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    customer_id: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    table_id: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    state: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    reservation_time: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    reservation_date: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)