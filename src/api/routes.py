"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, url_for, Blueprint
from api.models import db, User, Gerente
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['GET'])
def handle_hello():
    return jsonify({
        "message": "API funcionando "
    }), 200


# =========================
# CRUD GERENTE
# =========================

# 🔹 GET todos
@api.route('/gerentes', methods=['GET'])
def get_gerentes():
    gerentes = Gerente.query.all()
    return jsonify([g.serialize() for g in gerentes]), 200


# 🔹 GET uno
@api.route('/gerentes/<int:id>', methods=['GET'])
def get_gerente(id):
    gerente = Gerente.query.get(id)
    if not gerente:
        return jsonify({"msg": "No encontrado"}), 404
    return jsonify(gerente.serialize()), 200


# 🔹 POST (crear)
@api.route('/gerentes', methods=['POST'])
def create_gerente():
    data = request.json

    usuario = Gerente.query.filter_by(email=data.get("email")).first()
    if usuario:
        return jsonify({"msg": "ya existe el usuario"}), 400

    nuevo = Gerente(
        name=data.get("name"),
        lastname=data.get("lastname"),
        phone=data.get("phone"),
        email=data.get("email"),
        password=data.get("password")
    )

    db.session.add(nuevo)
    db.session.commit()

    return jsonify(nuevo.serialize()), 201


# 🔹 PUT (actualizar)
@api.route('/gerentes/<int:id>', methods=['PUT'])
def update_gerente(id):
    gerente = Gerente.query.get(id)
    if not gerente:
        return jsonify({"msg": "No encontrado"}), 404

    data = request.json

    gerente.name = data.get("name", gerente.name)
    gerente.lastname = data.get("lastname", gerente.lastname)
    gerente.phone = data.get("phone", gerente.phone)
    gerente.email = data.get("email", gerente.email)

    db.session.commit()

    return jsonify(gerente.serialize()), 200


# 🔹 DELETE
@api.route('/gerentes/<int:id>', methods=['DELETE'])
def delete_gerente(id):
    gerente = Gerente.query.get(id)
    if not gerente:
        return jsonify({"msg": "No encontrado"}), 404

    db.session.delete(gerente)
    db.session.commit()

    return jsonify({"msg": "Eliminado"}), 200
