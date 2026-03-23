"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from datetime import datetime
from flask_cors import CORS

from api.models import db, User, Restaurante, Cliente, Mesa, Reserva, Menu, Venta, DetalleVenta
from api.utils import generate_sitemap, APIException

api = Blueprint('api', __name__)
CORS(api)


# ================= TEST =================

@api.route('/hello', methods=['GET'])
def handle_hello():
    return jsonify({"message": "API funcionando 🚀"}), 200


# ================= RESTAURANTES =================

@api.route('/restaurantes', methods=['POST'])
def create_restaurante():
    data = request.json
    nuevo = Restaurante(**data)
    db.session.add(nuevo)
    db.session.commit()
    return jsonify(nuevo.serialize()), 201


@api.route('/restaurantes', methods=['GET'])
def get_restaurantes():
    return jsonify([r.serialize() for r in Restaurante.query.all()])


# ================= CLIENTES =================

@api.route('/clientes', methods=['POST'])
def create_cliente():
    data = request.json

    if Cliente.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email ya existe"}), 400

    c = Cliente(**data)
    db.session.add(c)
    db.session.commit()
    return jsonify(c.serialize()), 201


@api.route('/clientes', methods=['GET'])
def get_clientes():
    return jsonify([c.serialize() for c in Cliente.query.all()])


# ================= MESAS =================

@api.route('/mesas', methods=['POST'])
def create_mesa():
    data = request.json

    if not Restaurante.query.get(data['id_restaurante']):
        return jsonify({"error": "Restaurante no existe"}), 404

    m = Mesa(**data)
    db.session.add(m)
    db.session.commit()
    return jsonify(m.serialize()), 201


@api.route('/mesas', methods=['GET'])
def get_mesas():
    return jsonify([m.serialize() for m in Mesa.query.all()])


# ================= RESERVAS =================

@api.route('/reservas', methods=['POST'])
def create_reserva():
    data = request.json

    mesa = Mesa.query.get(data['id_mesa'])
    if not mesa:
        return jsonify({"error": "Mesa no existe"}), 404

    if data['num_personas'] > mesa.capacidad:
        return jsonify({"error": "Capacidad excedida"}), 400

    # 🔥 VALIDACIÓN PRO
    existe = Reserva.query.filter_by(
        id_mesa=data['id_mesa'],
        fecha=datetime.strptime(data['fecha'], "%Y-%m-%d"),
        hora=datetime.strptime(data['hora'], "%H:%M").time()
    ).first()

    if existe:
        return jsonify({"error": "Mesa ya reservada en ese horario"}), 400

    reserva = Reserva(
        id_cliente=data['id_cliente'],
        id_mesa=data['id_mesa'],
        id_restaurante=data['id_restaurante'],
        fecha=datetime.strptime(data['fecha'], "%Y-%m-%d"),
        hora=datetime.strptime(data['hora'], "%H:%M").time(),
        num_personas=data['num_personas']
    )

    db.session.add(reserva)
    db.session.commit()

    return jsonify(reserva.serialize()), 201


@api.route('/reservas', methods=['GET'])
def get_reservas():
    return jsonify([r.serialize() for r in Reserva.query.all()])


# ================= MENU =================

@api.route('/menu', methods=['POST'])
def create_menu():
    data = request.json
    p = Menu(**data)
    db.session.add(p)
    db.session.commit()
    return jsonify(p.serialize()), 201


@api.route('/menu', methods=['GET'])
def get_menu():
    return jsonify([p.serialize() for p in Menu.query.all()])


# ================= VENTAS =================

@api.route('/ventas', methods=['POST'])
def create_venta():
    data = request.json
    v = Venta(**data)
    db.session.add(v)
    db.session.commit()
    return jsonify(v.serialize()), 201


# ================= DETALLE =================

@api.route('/detalle-venta', methods=['POST'])
def create_detalle():
    data = request.json

    plato = Menu.query.get(data['id_plato'])
    if not plato:
        return jsonify({"error": "Plato no existe"}), 404

    subtotal = plato.precio * data['cantidad']

    d = DetalleVenta(
        id_venta=data['id_venta'],
        id_plato=data['id_plato'],
        cantidad=data['cantidad'],
        subtotal=subtotal
    )

    db.session.add(d)
    db.session.commit()

    return jsonify(d.serialize()), 201