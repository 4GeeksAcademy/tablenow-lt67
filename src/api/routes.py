from flask import request, jsonify, Blueprint
from api.models import db, User, Clients, Owner, Gerente, Restaurante, Menu, Venta, ItemVenta, Reserva
from flask_cors import CORS
from datetime import datetime, timedelta

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

@api.route('/restaurant', methods=['GET'])
def get_restaurantes():
    try:
        restaurantes = Restaurante.query.all()
        return jsonify([r.serialize() for r in restaurantes]), 200
    except Exception as e:
        return jsonify({"msg": "Error al obtener restaurantes", "error": str(e)}), 500

@api.route('/menus', methods=['GET'])
@api.route('/menu', methods=['GET']) 
def get_menus():
    menus = Menu.query.all()
    return jsonify([m.serialize() for m in menus]), 200

@api.route('/menus', methods=['POST'])
def create_menu():
    data = request.json
    print(f"DEBUG: Datos recibidos -> {data}") 
    
    try:
        if not data.get("nombre") or not data.get("precio") or not data.get("restaurante_id"):
            return jsonify({"error": "Faltan campos obligatorios (nombre, precio o restaurante_id)"}), 400

        nuevo_menu = Menu(
            nombre=data.get("nombre"),
            categoria=data.get("categoria"),
            precio=float(data.get("precio")), 
            restaurante_id=data.get("restaurante_id"),
            disponible=data.get("disponible", True)
        )
        
        db.session.add(nuevo_menu)
        db.session.commit()
        return jsonify(nuevo_menu.serialize()), 201

    except Exception as e:
        db.session.rollback() 
        print(f"ERROR EN POST /MENUS: {str(e)}") 
        return jsonify({"error": str(e)}), 500

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
# MIS RUTAS: GESTIÓN DE VENTAS 
# ==========================================
@api.route('/sales', methods=['GET'])
def get_all_sales():
    ventas = Venta.query.all()
    return jsonify([v.serialize() for v in ventas]), 200

@api.route('/sales/<int:venta_id>/checkout', methods=['PUT'])
def finalizar_venta(venta_id):
    venta = Venta.query.get(venta_id)
    if not venta:
        return jsonify({"msg": "Venta no encontrada"}), 404

    try:
        items = ItemVenta.query.filter_by(venta_id=venta_id).all()
        total_real = sum(item.cantidad * item.precio_unitario for item in items)

        venta.total = total_real
        venta.status = "paid"  
        
        db.session.commit()
        return jsonify(venta.serialize()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al finalizar venta", "error": str(e)}), 500

@api.route('/item_ventas/<int:venta_id>', methods=['GET'])
def get_items_by_sale(venta_id):
    try:
        items = ItemVenta.query.filter_by(venta_id=venta_id).all()
        return jsonify([item.serialize() for item in items]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/ventas', methods=['POST'])
def create_venta():
    try:
        data = request.json
        nueva_venta = Venta(
            total=data.get("total", 0.0),
            payment_method=data.get("payment_method", "cash"),
            status=data.get("status", "pending"), 
            cliente_id=data.get("cliente_id"),
            restaurante_id=data.get("restaurante_id"),
            fecha=datetime.utcnow() 
        )
        db.session.add(nueva_venta)
        db.session.commit()
        return jsonify(nueva_venta.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al crear la venta", "error": str(e)}), 500
    
@api.route('/item_ventas', methods=['POST'])
def create_item_venta():
    data = request.json
    
    venta_id = data.get("id_venta")  
    menu_id = data.get("id_menu")    
    cantidad = data.get("cantidad")
    precio_unitario = data.get("precio_unitario")

    if venta_id is None or menu_id is None or cantidad is None or precio_unitario is None:
        return jsonify({"error": "Faltan datos", "recibido": data}), 400

    try:
        nuevo_item = ItemVenta(
            venta_id=int(venta_id), 
            menu_id=int(menu_id),   
            cantidad=int(cantidad),
            precio_unitario=float(precio_unitario)
        )
        db.session.add(nuevo_item)
        db.session.commit()
        return jsonify(nuevo_item.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@api.route('/item_ventas/<int:item_id>', methods=['DELETE'])
def delete_item_venta(item_id):
    item = ItemVenta.query.get(item_id)
    if not item:
        return jsonify({"msg": "Item no encontrado"}), 404
    
    try:
        db.session.delete(item)
        db.session.commit()
        return jsonify({"msg": "Item eliminado correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
# =========================
# RESERVAS 
# =========================
@api.route('/booking', methods=['GET'])
def get_bookings():
    all_bookings = Reserva.query.all()
    return jsonify([b.serialize() for b in all_bookings]), 200
