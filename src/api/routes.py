from flask import request, jsonify, Blueprint
from api.models import db, User, Clients, Owner, Gerente, Restaurant
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
    if not gerente:
        return jsonify({"msg": "No encontrado"}), 404
    return jsonify(gerente.serialize()), 200


@api.route('/gerentes', methods=['POST'])
def create_gerente():
    data = request.json

    if not data:
        return jsonify({"msg": "Faltan datos"}), 400

    try:
        existing = Gerente.query.filter_by(email=data.get("email")).first()
        if existing:
            return jsonify({"msg": "Email ya existe"}), 400

        nuevo = Gerente(
            name=data.get("name"),
            lastname=data.get("lastname"),
            phone=data.get("phone"),
            email=data.get("email"),
            password=data.get("password"),
            date=datetime.utcnow()
        )

        db.session.add(nuevo)
        db.session.commit()

        return jsonify(nuevo.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al crear gerente", "error": str(e)}), 500


@api.route('/gerentes/<int:id>', methods=['PUT'])
def update_gerente(id):
    gerente = Gerente.query.get(id)

    if not gerente:
        return jsonify({"msg": "No encontrado"}), 404

    try:
        data = request.json

        gerente.name = data.get("name", gerente.name)
        gerente.lastname = data.get("lastname", gerente.lastname)
        gerente.phone = data.get("phone", gerente.phone)
        gerente.email = data.get("email", gerente.email)

        db.session.commit()
        return jsonify(gerente.serialize()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar", "error": str(e)}), 500


@api.route('/gerentes/<int:id>', methods=['DELETE'])
def delete_gerente(id):
    gerente = Gerente.query.get(id)

    if not gerente:
        return jsonify({"msg": "No encontrado"}), 404

    try:
        db.session.delete(gerente)
        db.session.commit()
        return jsonify({"msg": "Eliminado"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar", "error": str(e)}), 500


# =========================
# CRUD CLIENTS 
# =========================

@api.route('/clients', methods=['GET'])
def get_clients():
    clients = Clients.query.all()
    return jsonify([c.serialize() for c in clients]), 200


@api.route('/client/<int:id>', methods=['GET'])
def get_client(id):
    client = Clients.query.get(id)
    if not client:
        return jsonify({"msg": "No encontrado"}), 404
    return jsonify(client.serialize()), 200


@api.route('/clients', methods=['POST'])
def create_client():
    data = request.json

    if not data:
        return jsonify({"msg": "Faltan datos"}), 400

    try:
        existing = Clients.query.filter_by(email=data.get("email")).first()
        if existing:
            return jsonify({"msg": "Email ya existe"}), 400

        client = Clients(
            name=data.get("name"),
            email=data.get("email"),
            phone=data.get("phone"),
            password=data.get("password"),
            is_active=True
        )

        db.session.add(client)
        db.session.commit()

        return jsonify(client.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al crear", "error": str(e)}), 500


@api.route('/client/<int:id>', methods=['PUT'])
def update_client(id):
    client = Clients.query.get(id)

    if not client:
        return jsonify({"msg": "No encontrado"}), 404

    try:
        data = request.json

        client.name = data.get("name", client.name)
        client.email = data.get("email", client.email)
        client.phone = data.get("phone", client.phone)
        client.password = data.get("password", client.password)

        db.session.commit()
        return jsonify(client.serialize()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar", "error": str(e)}), 500


@api.route('/client/<int:id>', methods=['DELETE'])
def delete_client(id):
    client = Clients.query.get(id)

    if not client:
        return jsonify({"msg": "No encontrado"}), 404

    try:
        db.session.delete(client)
        db.session.commit()
        return jsonify({"msg": "Eliminado"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar", "error": str(e)}), 500


# =========================
# CRUD OWNER
# =========================

@api.route('/owners', methods=['GET'])
def get_owners():

    all_owners = Owner.query.all()
    results = list(map(lambda owner: owner.serialize(), all_owners))

    return jsonify(results), 200

@api.route('/owner/<int:owner_id>', methods=['GET'])
def get_owner(owner_id):

    owner = Owner.query.filter_by(id=owner_id).first()

    if owner is None:
        return jsonify({
            "error": "Owner not found"
        }), 400

    return jsonify(owner.serialize()), 200

@api.route('/owner/<int:owner_id>', methods=['DELETE'])
def delete_owner(owner_id):

    owner = Owner.query.filter_by(id=owner_id).first()
    if owner is None:
        return jsonify({
            "error": "Owner not found"
        }), 404
    
    db.session.delete(owner)
    db.session.commit()

    return jsonify({"message": "Owner " + owner.name + " deleted succesfully."}), 200

@api.route('/owners', methods=['POST'])
def create_owner():

    body = request.get_json()
    owner = Owner.query.filter_by(email=body['email']).first()
    
    if owner:
        return jsonify({
            "error": "This email already exists"
        }), 401
    
    owner = Owner(**body, is_active=True)
    db.session.add(owner)
    db.session.commit()

    response_body = {
        "message": "New owner created"
    }
    return jsonify(response_body), 200

@api.route('/owner/<int:owner_id>', methods=['PUT'])
def update_info_owner(owner_id):

    owner = Owner.query.filter_by(id=owner_id).first()
    body = request.get_json()
    if owner is None:
        return jsonify({
            "error": "Owner not found"
        }), 404
    owner.name = body.get('name',owner.name)
    owner.email = body.get('email',owner.email)
    owner.phone = body.get('phone',owner.phone)
    owner.password = body.get('password',owner.password)
   
    
    db.session.commit()

    return jsonify(owner.serialize()), 200


# =========================
# CRUD RESTAURANT
# =========================

@api.route('/restaurants', methods=['GET'])
def get_restaurants():

    all_restaurants = Restaurant.query.all()
    results = list(map(lambda owner: owner.serialize(), all_restaurants))

    return jsonify(results), 200

@api.route('/restaurant/<int:restaurant_id>', methods=['GET'])
def get_restaurant(restaurant_id):

    restaurant = Restaurant.query.filter_by(id=restaurant_id).first()

    if restaurant is None:
        return jsonify({
            "error": "Restaurant not found"
        }), 400

    return jsonify(restaurant.serialize()), 200


@api.route('/restaurant/<int:restaurant_id>', methods=['DELETE'])
def delete_restaurant(restaurant_id):

    restaurant = Restaurant.query.filter_by(id=restaurant_id).first()
    if restaurant is None:
        return jsonify({
            "error": "Restaurant not found"
        }), 404
    
    db.session.delete(restaurant)
    db.session.commit()

    return jsonify({"message": "Restaurant " + restaurant.name + " deleted succesfully."}), 200


@api.route('/restaurants', methods=['POST'])
def create_restaurant():

    body = request.get_json()
    restaurant = Restaurant.query.filter_by(name=body['name']).first()

    if restaurant:
        return jsonify({
            "error": "This restaurant name already exists"
        }), 401
    
    restaurant = Restaurant(**body)
    db.session.add(restaurant)
    db.session.commit()

    response_body = {
        "message": "New restaurant created"
    }
    return jsonify(response_body), 200


@api.route('/restaurant/<int:restaurant_id>', methods=['PUT'])
def update_info_restaurant(restaurant_id):

    restaurant = Restaurant.query.filter_by(id=restaurant_id).first()
    body = request.get_json()
    if restaurant is None:
        return jsonify({
            "error": "Restaurant not found"
        }), 404
    restaurant.id_owner = body.get('id_owner',restaurant.id_owner)
    restaurant.name = body.get('name',restaurant.name)
    restaurant.address = body.get('address',restaurant.address)
    restaurant.phone = body.get('phone',restaurant.phone)
    restaurant.total_capacity = body.get('total_capacity',restaurant.total_capacity)
   
    
    db.session.commit()

    return jsonify(restaurant.serialize()), 200