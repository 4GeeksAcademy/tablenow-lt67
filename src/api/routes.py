from flask import request, jsonify, Blueprint
from api.models import db, User, Clients, Owner, Gerente, Restaurante, Menu, Venta, ItemVenta
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
    owners = Owner.query.all()
    return jsonify([o.serialize() for o in owners]), 200


@api.route('/owner/<int:id>', methods=['GET'])
def get_owner(id):
    owner = Owner.query.get(id)
    if not owner:
        return jsonify({"msg": "No encontrado"}), 404
    return jsonify(owner.serialize()), 200


@api.route('/owners', methods=['POST'])
def create_owner():
    data = request.json

    try:
        existing = Owner.query.filter_by(email=data.get("email")).first()
        if existing:
            return jsonify({"msg": "Email ya existe"}), 400

        owner = Owner(**data, is_active=True)
        db.session.add(owner)
        db.session.commit()

        return jsonify(owner.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al crear", "error": str(e)}), 500


@api.route('/owner/<int:id>', methods=['PUT'])
def update_owner(id):
    owner = Owner.query.get(id)

    if not owner:
        return jsonify({"msg": "No encontrado"}), 404

    try:
        data = request.json

        owner.name = data.get("name", owner.name)
        owner.email = data.get("email", owner.email)
        owner.phone = data.get("phone", owner.phone)
        owner.password = data.get("password", owner.password)

        db.session.commit()
        return jsonify(owner.serialize()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar", "error": str(e)}), 500


@api.route('/owner/<int:id>', methods=['DELETE'])
def delete_owner(id):
    owner = Owner.query.get(id)

    if not owner:
        return jsonify({"msg": "No encontrado"}), 404

    try:
        db.session.delete(owner)
        db.session.commit()
        return jsonify({"msg": "Eliminado"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar", "error": str(e)}), 500

# =========================
# CRUD MENU & RESTAURANTE
# =========================

@api.route('/restaurantes', methods=['POST'])
def create_restaurante():
    data = request.json
    try:
        nuevo = Restaurante(nombre=data.get("nombre"))
        db.session.add(nuevo)
        db.session.commit()
        return jsonify(nuevo.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error", "error": str(e)}), 500

@api.route('/menus', methods=['GET'])
def get_menus():
    menus = Menu.query.all()
    return jsonify([m.serialize() for m in menus]), 200

@api.route('/menus', methods=['POST'])
def create_menu():
    data = request.json
    try:
        nuevo_menu = Menu(
            nombre=data.get("nombre"),
            categoria=data.get("categoria"),
            precio=data.get("precio"),
            restaurante_id=data.get("restaurante_id"),
            disponible=data.get("disponible", True)
        )
        db.session.add(nuevo_menu)
        db.session.commit()
        return jsonify(nuevo_menu.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al crear menu", "error": str(e)}), 500

@api.route('/menus/<int:id>', methods=['DELETE'])
def delete_menu(id):
    menu = Menu.query.get(id)
    if not menu:
        return jsonify({"msg": "Plato no encontrado"}), 404
    try:
        db.session.delete(menu)
        db.session.commit()
        return jsonify({"msg": "Plato eliminado correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar", "error": str(e)}), 500

# ==========================================
# MIS RUTAS: GESTIÓN DE VENTAS (RAMA 9 y 10)
# ==========================================

@api.route('/ventas', methods=['GET'])
def get_ventas():
    ventas = Venta.query.all()
    return jsonify([v.serialize() for v in ventas]), 200

@api.route('/ventas', methods=['POST'])
def create_venta():
    data = request.json
    try:
        nueva_venta = Venta(
            cliente=data.get("cliente"),
            total=data.get("total", 0.0)
        )
        db.session.add(nueva_venta)
        db.session.flush() 

        items = data.get("items", [])
        for item in items:
            nuevo_item = ItemVenta(
                venta_id=nueva_venta.id,
                menu_id=item.get("menu_id"),
                cantidad=item.get("cantidad"),
                precio_unitario=item.get("precio_unitario")
            )
            db.session.add(nuevo_item)
        
        db.session.commit()
        return jsonify(nueva_venta.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al procesar la venta", "error": str(e)}), 500