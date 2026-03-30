from flask import request, jsonify, Blueprint
from api.models import db, User, Clients, Owner, Gerente, Sale, ItemVenta
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
# CRUD SALES, RESTAURANT & BOOKING
# =========================

@api.route('/sales', methods=['GET'])
def get_sales():
    all_sales = Sale.query.all()
    return jsonify([sale.serialize() for sale in all_sales]), 200

@api.route('/sales', methods=['POST'])
def create_sale():
    data = request.json
    if not data: 
        return jsonify({"msg": "Faltan datos"}), 400
    try:
        new_sale = Sale(
            total=data.get("total"),
            payment_method=data.get("payment_method"),
            status=data.get("status", "pending"), 
            reserva_id=data.get("booking_id"),
            restaurante_id=data.get("restaurant_id")
        )
        db.session.add(new_sale)
        db.session.commit()
        return jsonify(new_sale.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@api.route('/restaurant', methods=['GET'])
def get_restaurants():
    from api.models import Restaurante 
    all_restaurants = Restaurante.query.all()
    return jsonify([r.serialize() for r in all_restaurants]), 200

@api.route('/booking', methods=['GET'])
def get_bookings():
    from api.models import Reserva
    all_bookings = Reserva.query.all()
    return jsonify([b.serialize() for b in all_bookings]), 200

# =========================
# CRUD Item_ventas
# =========================

@api.route('/item_ventas', methods=['POST'])
def create_item_venta():
    data = request.json
    if not data:
        return jsonify({"msg": "Faltan datos"}), 400
        
    try:
        nuevo_item = ItemVenta(
            id_venta=data.get("id_venta"),
            id_menu=data.get("id_menu"),
            cantidad=data.get("cantidad"),
            precio_unitario=data.get("precio_unitario"),
            subtotal=data.get("subtotal")
        )
        db.session.add(nuevo_item)
        db.session.commit()
        return jsonify(nuevo_item.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@api.route('/item_ventas/<int:sale_id>', methods=['GET'])
def get_items_by_sale(sale_id):
    # Esto servirá para mostrar el detalle de una venta específica
    items = ItemVenta.query.filter_by(id_venta=sale_id).all()
    return jsonify([item.serialize() for item in items]), 200

# =========================
# FINALIZAR VENTA (CHECKOUT)
# =========================

@api.route('/sales/<int:sale_id>/checkout', methods=['PUT'])
def checkout_sale(sale_id):
    # 1. Buscar la venta (usamos Sale porque así está en tus imports)
    sale = Sale.query.get(sale_id)
    if not sale:
        return jsonify({"msg": "Venta no encontrada"}), 404

    items = ItemVenta.query.filter_by(id_venta=sale_id).all()
    
    if not items:
        return jsonify({"msg": "No se pueden finalizar ventas sin productos"}), 400

    total_real = sum(item.subtotal for item in items)

    sale.total = total_real
    sale.status = 'paid' 

    try:
        db.session.commit()
        return jsonify(sale.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al procesar el pago", "error": str(e)}), 500
