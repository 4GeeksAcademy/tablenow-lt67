"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from api.models import db, User, Clients, Gerente 
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime

api = Blueprint('api', __name__)

CORS(api)

@api.route('/hello', methods=['GET'])
def handle_hello():
    return jsonify({"message": "API funcionando"}), 200

# =========================
# CRUD GERENTE
# =========================

@api.route('/gerentes', methods=['GET'])
def get_gerentes():
    gerentes = Gerente.query.all()
    return jsonify([g.serialize() for g in gerentes]), 200

@api.route('/gerentes/<int:id>', methods=['GET'])
def get_gerente(id):
    gerente = Gerente.query.get(id)
    if not gerente: return jsonify({"msg": "No encontrado"}), 404
    return jsonify(gerente.serialize()), 200

@api.route('/gerentes', methods=['POST'])
def create_gerente():
    data = request.json
    # Verificamos que lleguen los datos mínimos para evitar errores 500
    if not data:
        return jsonify({"msg": "Faltan datos en el cuerpo de la solicitud"}), 400
        
    nuevo = Gerente(
        name=data.get("name"),
        lastname=data.get("lastname"),
        phone=data.get("phone"),
        email=data.get("email"),
        password=data.get("password"),
        date=datetime.utcnow() # <--- SOLUCIÓN: Agregamos la fecha actual obligatoria
    )
    
    try:
        db.session.add(nuevo)
        db.session.commit()
        return jsonify(nuevo.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al crear gerente", "error": str(e)}), 500

@api.route('/gerentes/<int:id>', methods=['PUT'])
def update_gerente(id):
    gerente = Gerente.query.get(id)
    if not gerente: return jsonify({"msg": "No encontrado"}), 404
    data = request.json
    gerente.name = data.get("name", gerente.name)
    gerente.lastname = data.get("lastname", gerente.lastname)
    gerente.phone = data.get("phone", gerente.phone)
    gerente.email = data.get("email", gerente.email)
    db.session.commit()
    return jsonify(gerente.serialize()), 200

@api.route('/gerentes/<int:id>', methods=['DELETE'])
def delete_gerente(id):
    gerente = Gerente.query.get(id)
    if not gerente: return jsonify({"msg": "No encontrado"}), 404
    db.session.delete(gerente)
    db.session.commit()
    return jsonify({"msg": "Eliminado"}), 200

# =========================
# CRUD CLIENTS
# =========================

@api.route('/clients', methods=['GET'])
def get_clients():
    all_clients = Clients.query.all()
    results = [client.serialize() for client in all_clients]
    return jsonify(results), 200

@api.route('/client/<int:client_id>', methods=['GET'])
def get_client(client_id):
    client = Clients.query.get(client_id)
    if not client: return jsonify({"error": "Client not found"}), 404
    return jsonify(client.serialize()), 200

@api.route('/clients', methods=['POST'])
def create_client():
    body = request.get_json()
    new_client = Clients(
        name=body.get("name"),
        email=body.get("email"),
        phone=body.get("phone"),
        password=body.get("password"),
        is_active=True
    )
    db.session.add(new_client)
    db.session.commit()
    return jsonify(new_client.serialize()), 201

@api.route('/client/<int:client_id>', methods=['PUT'])
def update_client(client_id):
    client = Clients.query.get(client_id)
    if not client: return jsonify({"error": "Client not found"}), 404
    body = request.get_json()
    client.name = body.get('name', client.name)
    client.email = body.get('email', client.email)
    client.phone = body.get('phone', client.phone)
    client.password = body.get('password', client.password)
    db.session.commit()
    return jsonify(client.serialize()), 200

@api.route('/client/<int:client_id>', methods=['DELETE'])
def delete_client(client_id):
    client = Clients.query.get(client_id)
    if not client: return jsonify({"error": "Client not found"}), 404
    db.session.delete(client)
    db.session.commit()
    return jsonify({"message": "Client deleted successfully"}), 200