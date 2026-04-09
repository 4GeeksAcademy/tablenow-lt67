from flask import request, jsonify, Blueprint
from api.models import db, User, Clients, Owner, Gerente, Restaurante, Menu, Venta, ItemVenta, Reserva, Hostess, Table, Waitlist, Empleado
from flask_cors import CORS
from datetime import datetime, timedelta
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

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
@api.route('/restaurants', methods=['GET'])
def get_restaurantes():
    try:
        restaurantes = Restaurante.query.all()
        return jsonify([r.serialize() for r in restaurantes]), 200
    except Exception as e:
        return jsonify({"msg": "Error al obtener restaurantes", "error": str(e)}), 500

@api.route('/restaurants', methods=['POST']) 
@jwt_required()
def crear_restaurante():
    identity = get_jwt_identity()
    body = request.get_json()
    
    if not body or not body.get("nombre") or not body.get("image_url"):
        return jsonify({"msg": "Nombre e imagen son obligatorios"}), 400

    try:
        nuevo_restaurante = Restaurante(
            nombre=body["nombre"],
            direccion=body.get("direccion"),
            telefono=body.get("telefono"),
            capacidad_total=body.get("capacidad_total"),
            image_url=body.get("image_url"),
            latitud=body.get("latitud"),  
            longitud=body.get("longitud"), 
            owner_id=int(identity) 
        )
        
        db.session.add(nuevo_restaurante)
        db.session.commit()
        
        return jsonify(nuevo_restaurante.serialize()), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error al crear restaurante: {str(e)}") 
        return jsonify({"msg": "Error interno al crear", "error": str(e)}), 500

@api.route('/restaurants/<int:id>', methods=['PUT'])
@jwt_required()
def update_restaurante(id):
    current_owner_id = get_jwt_identity()
    restaurante = Restaurante.query.filter_by(id=id, owner_id=int(current_owner_id)).first()

    if not restaurante:
        return jsonify({"msg": "No encontrado o sin permiso"}), 404

    try:
        data = request.get_json()
        if not data:
            return jsonify({"msg": "No se enviaron datos"}), 400

        restaurante.nombre = data.get("nombre", restaurante.nombre)
        restaurante.direccion = data.get("direccion", restaurante.direccion)
        restaurante.telefono = data.get("telefono", restaurante.telefono)
        restaurante.latitud = data.get("latitud", restaurante.latitud)
        restaurante.longitud = data.get("longitud", restaurante.longitud)
        
        if "capacidad_total" in data and data["capacidad_total"] not in [None, ""]:
            try:
                restaurante.capacidad_total = int(data["capacidad_total"])
            except ValueError:
                return jsonify({"msg": "Capacidad total debe ser un número válido"}), 400

        db.session.commit()
        return jsonify(restaurante.serialize()), 200

    except Exception as e:
        db.session.rollback()
        print(f"DEBUG ERROR: {str(e)}") 
        return jsonify({"msg": "Error al actualizar", "error": str(e)}), 500
    
@api.route('/restaurants/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_restaurante(id):
    current_owner_id = get_jwt_identity()
    restaurante = Restaurante.query.filter_by(id=id, owner_id=int(current_owner_id)).first()

    if not restaurante:
        return jsonify({"msg": "No se encontró el restaurante o no tienes permiso"}), 404

    try:        
        Menu.query.filter_by(restaurante_id=id).delete()
        
        Reserva.query.filter_by(restaurante_id=id).delete()
        
        Hostess.query.filter_by(restaurante_id=id).delete()

        Venta.query.filter_by(restaurante_id=id).delete()

        Table.query.filter_by(restaurante_id=id).delete()
    
        db.session.delete(restaurante)
        db.session.commit()
        
        return jsonify({"msg": "Restaurante y todos sus datos asociados eliminados"}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error al eliminar: {str(e)}") 
        return jsonify({
            "msg": "Error al eliminar el restaurante. Es posible que tenga registros de ventas activos.",
            "error": str(e)
        }), 500

@api.route('/menus', methods=['GET'])
@api.route('/menu', methods=['GET']) 
def get_menus():
    menus = Menu.query.all()
    return jsonify([m.serialize() for m in menus]), 200

@api.route('/menus', methods=['POST'])
def create_menu():
    
    data = request.get_json()
    print(f"DEBUG: Datos recibidos -> {data}") 
    
    if not data:
        return jsonify({"error": "No se recibió información en el cuerpo de la solicitud"}), 400

    
    restaurante_id = data.get("restaurante_id")
    if not restaurante_id:
        return jsonify({"error": "Falta el campo obligatorio: restaurante_id"}), 400

    
    restaurante = Restaurante.query.get(restaurante_id)
    if not restaurante:
        return jsonify({
            "error": f"El restaurante con ID {restaurante_id} no existe. Revisa los IDs disponibles en /api/restaurants"
        }), 400 

    
    try:
        nombre = data.get("nombre")
        precio = data.get("precio")

        if not nombre or not precio:
            return jsonify({"error": "Faltan campos obligatorios: nombre o precio"}), 400

        nuevo_menu = Menu(
            nombre=nombre,
            categoria=data.get("categoria"),
            precio=float(precio), 
            restaurante_id=int(restaurante_id),
            disponible=data.get("disponible", True)
        )
        
        db.session.add(nuevo_menu)
        db.session.commit()
        
        return jsonify(nuevo_menu.serialize()), 201

    except ValueError:
        return jsonify({"error": "El precio debe ser un número válido"}), 400
    except Exception as e:
        db.session.rollback() 
        print(f"--> ERROR CRÍTICO EN POST /MENUS: {str(e)}") 
        return jsonify({"error": "Error interno del servidor", "details": str(e)}), 500
    
@api.route('/menus/<int:id>', methods=['PUT'])
def update_menu(id):
    menu = Menu.query.get(id)
    if not menu:
        return jsonify({"msg": "Plato no encontrado"}), 404

    try:
        data = request.json
        menu.nombre = data.get("nombre", menu.nombre)
        menu.categoria = data.get("categoria", menu.categoria)
        menu.precio = float(data.get("precio", menu.precio))
        menu.disponible = data.get("disponible", menu.disponible)
        
        menu.restaurante_id = data.get("restaurante_id", menu.restaurante_id)

        db.session.commit()
        return jsonify(menu.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar el plato", "error": str(e)}), 500

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
    data = request.json
    try:
        if not data.get("restaurante_id"):
            return jsonify({"msg": "restaurante_id es obligatorio"}), 400

        nueva_venta = Venta(
            total=data.get("total", 0.0),
            payment_method=data.get("payment_method", "cash"),
            status=data.get("status", "pending"), 
            cliente_id=data.get("cliente_id"), 
            restaurante_id=data.get("restaurante_id"),
            fecha=datetime.now() 
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
    v_id = data.get("venta_id") or data.get("id_venta")
    m_id = data.get("menu_id") or data.get("id_menu")

    if not v_id or not m_id:
        return jsonify({"error": "Faltan IDs de venta o menú"}), 400

    try:
        nuevo_item = ItemVenta(
            venta_id=int(v_id), 
            menu_id=int(m_id),   
            cantidad=int(data.get("cantidad", 1)),
            precio_unitario=float(data.get("precio_unitario"))
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
    
# ==========================================
# GESTIÓN DE RESERVAS 
# ==========================================

@api.route('/restaurant/<int:restauranteId>/bookings', methods=['GET'])
@jwt_required()
def get_bookings_by_restaurant(restauranteId):
    """ Obtiene las reservas de un restaurante asegurando que pertenezca al Owner """
    current_owner_id = get_jwt_identity()
    
    restaurante = Restaurante.query.filter_by(id=restauranteId, owner_id=int(current_owner_id)).first()
    
    if not restaurante:
        return jsonify({"msg": "Acceso denegado a este restaurante o no existe"}), 403

    reservas = Reserva.query.filter_by(restaurante_id=restauranteId).all()
    
    return jsonify([reserva.serialize() for reserva in reservas]), 200

@api.route('/bookings', methods=['GET'])
def get_all_bookings():
    try:
        reservas = Reserva.query.all()
        print(f"DEBUG: Reservas encontradas en DB -> {len(reservas)}") 
        return jsonify([r.serialize() for r in reservas]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/booking', methods=['POST'])
def crear_reserva():
    data = request.json
    if not data:
        return jsonify({"msg": "Faltan datos"}), 400
        
    try:
        nueva_reserva = Reserva(
            fecha=data.get("fecha"),
            hora=data.get("hora"),
            num_personas=data.get("num_personas"),
            id_mesa=data.get("id_mesa"), 
            restaurante_id=data.get("restaurante_id"),
            cliente_id=data.get("cliente_id"),
            notas=data.get("notas"),
            origen=data.get("origen", "online"),
            estado="pendiente"
        )
        db.session.add(nueva_reserva)
        db.session.commit()
        return jsonify(nueva_reserva.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al crear reserva", "error": str(e)}), 500


@api.route('/booking/<int:booking_id>/status', methods=['PUT'])
@jwt_required()
def update_booking_status(booking_id):
    body = request.get_json()
    
    nuevo_estado = body.get("status") or body.get("estado")
    
    if not nuevo_estado:
        return jsonify({"msg": "Debes proporcionar un estado o status"}), 400

    reserva = Reserva.query.get(booking_id)
    if not reserva:
        return jsonify({"msg": "Reserva no encontrada"}), 404

    reserva.estado = nuevo_estado
    db.session.commit()
    return jsonify(reserva.serialize()), 200


@api.route('/booking/<int:booking_id>', methods=['DELETE'])
@jwt_required()
def delete_booking(booking_id):
    reserva = Reserva.query.get(booking_id)
    
    if not reserva:
        return jsonify({"msg": "Reserva no encontrada"}), 404

    try:
        db.session.delete(reserva)
        db.session.commit()
        return jsonify({"msg": "Reserva eliminada con éxito"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar", "error": str(e)}), 500

# =========================
# LOGIN-OWNER
# =========================

@api.route('/owner/restaurants', methods=['GET'])
@jwt_required()
def get_owner_restaurants():
    current_owner_id = get_jwt_identity()
    restaurantes = Restaurante.query.filter_by(owner_id=current_owner_id).all()
    return jsonify([r.serialize() for r in restaurantes]), 200

@api.route('/login-owner', methods=['POST'])
def login_owner():
    body = request.get_json()
    owner = Owner.query.filter_by(email=body.get("email")).first()
    if owner is None or owner.password != body.get("password"):
        return jsonify({"msg": "Credenciales inválidas"}), 401
    
    access_token = create_access_token(identity=str(owner.id))
    return jsonify({
        "token": access_token,
        "role": "owner",
        "id": owner.id,
        "name": owner.name
    }), 200

# ==========================================
# RUTAS (Adaptadas a Hostess)
# ==========================================

@api.route('/host', methods=['GET'])
def get_hosts():
    hosts = Hostess.query.all()
    respuesta = list(map(lambda host: host.serialize(), hosts))
    return jsonify(respuesta), 200

@api.route('/host/<int:host_id>', methods=['GET'])
def get_host(host_id):
    host = Hostess.query.filter_by(id=host_id).first()
    if host is None:
        return jsonify({"message": f"no se encontro el host con el id: {host_id}"}), 404
    return jsonify(host.serialize()), 200

@api.route('/host', methods=['POST'])
def create_host():
    body = request.get_json()
    
    new_host = Hostess(
        first_name=body['first_name'],
        last_name=body['last_name'],
        email=body['email'],
        password=body['password'],  
        phone_number=body['phone_number'],
        special_notes=body.get('special_notes'),
        
        total_visits=body.get('total_visits', 0), 
        last_visit=body.get('last_visit'),
        
        restaurante_id=body['restaurante_id']
    )
    
    db.session.add(new_host)
    db.session.commit()
    
    return jsonify(new_host.serialize()), 201

@api.route('/host/<int:host_id>', methods=['PUT'])
def update_host(host_id):
    host = Hostess.query.get(host_id)
    if not host:
        return jsonify({"message": "Host not found"}), 404
        
    body = request.get_json()
    
    host.first_name = body.get('first_name', host.first_name)
    host.last_name = body.get('last_name', host.last_name)
    host.email = body.get('email', host.email)
    host.phone_number = body.get('phone_number', host.phone_number)
    host.special_notes = body.get('special_notes', host.special_notes)
    host.password = body.get('password', host.password) 

    host.total_visits = body.get('total_visits', host.total_visits)
    host.last_visit = body.get('last_visit', host.last_visit)
    
    db.session.commit()
    return jsonify(host.serialize()), 200

@api.route('/host/<int:host_id>', methods=['DELETE'])
def delete_host(host_id):
    host = Hostess.query.get(host_id)
    
    if host is None:
        return jsonify({"message": f"No se encontró el host con el id: {host_id}"}), 404
    
    try:
        db.session.delete(host)
        db.session.commit()
        return jsonify({"message": "Host eliminado correctamente"}), 200
    except Exception as e:
        db.session.rollback() 
        return jsonify({"message": "Error al eliminar el host", "error": str(e)}), 500

# ======================================================
# 🚀 FLUJO DE CLIENTE 
# ======================================================

@api.route('/signup-client', methods=['POST'])
def signup_client():
    body = request.get_json()
    if not body: return jsonify({"msg": "Faltan datos"}), 400
    
    email = body.get("email")
    if Clients.query.filter_by(email=email).first():
        return jsonify({"msg": "El email ya está registrado"}), 400

    new_client = Clients(
        name=body.get("name"),
        email=email,
        phone=body.get("phone"),
        password=body.get("password"),
        image_url=body.get("image_url"), 
        latitud=body.get("latitud"),   
        longitud=body.get("longitud"), 
        is_active=True
    )
    db.session.add(new_client)
    db.session.commit()
    return jsonify({"msg": "Cliente registrado con éxito", "id": new_client.id}), 201

@api.route('/login-client', methods=['POST'])
def login_client():
    body = request.get_json()
    client = Clients.query.filter_by(email=body.get("email")).first()

    if client is None or client.password != body.get("password"):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    
    access_token = create_access_token(identity=str(client.id))
    return jsonify({
        "token": access_token,
        "role": "client",
        "client": client.serialize()
    }), 200

# =========================   
# EMPLEADOS
# =========================

@api.route('/empleado', methods=['GET'])
def get_empleados():
    empleados = Empleado.query.all()
    print(empleados)
    respuesta = list(map(lambda empleado: empleado.serialize(), empleados))
    return jsonify(respuesta), 200

@api.route('/empleado/<int:empleado_id>', methods=['GET'])
def get_empleado(empleado_id):
    empleado = Empleado.query.filter_by(id=empleado_id).first()
    if empleado is None:
        return jsonify({
            "message": "no se encontro al empleado con el id: " + str(empleado_id)
        })
    return jsonify(empleado.serialize()), 200

@api.route('/empleado/<int:empleado_id>', methods=['DELETE'])
def delete_empleado(empleado_id):
    empleado = Empleado.query.filter_by(id=empleado_id).first()
    if empleado is None:
        return {
            "message": "no se encontro al empleado con el id: " + str(empleado_id)
        },400
    print(empleado.serialize())
    db.session.delete(empleado)
    db.session.commit()
    response_body = {
        "message": "se elimino al empleado"
    }

    return jsonify(response_body), 200

@api.route('/empleado', methods=['POST'])
def create_empleado():
    body = request.get_json()
    
    required_fields = ["name", "email", "phone", "rol", "password"] 
    for field in required_fields:
        if field not in body:
            return jsonify({"message": f"Falta el campo obligatorio: {field}"}), 400

    try:
        nuevo_empleado = Empleado(
            full_name=body["name"], 
            email=body["email"],
            phone=body["phone"],
            rol=body["rol"],
            state=body.get("state"),
            password=body["password"]
        )
        db.session.add(nuevo_empleado)
        db.session.commit()
        
        return jsonify({
            "message": "Empleado creado con éxito",
            "empleado": nuevo_empleado.serialize()
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error en POST /empleado: {str(e)}") 
        return jsonify({"message": "Error interno", "error": str(e)}), 500


@api.route('/empleado/<int:empleado_id>', methods=['PUT'])
def update_empleado(empleado_id):
    empleado = Empleado.query.get(empleado_id)
    if empleado is None:
        return jsonify({"message": "No encontrado"}), 404
    
    body = request.get_json()
    
    if "name" in body: empleado.full_name = body["name"] 
    if "email" in body: empleado.email = body["email"]
    if "phone" in body: empleado.phone = body["phone"]
    if "rol" in body: empleado.rol = body["rol"]
    if "state" in body: empleado.state = body["state"]
    if "password" in body: empleado.password = body["password"]

    try:
        db.session.commit()
        return jsonify({"message": "Actualizado", "empleado": empleado.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al actualizar", "error": str(e)}), 500

# =========================   
# LOGIN EMPLEADO
# =========================

@api.route('/login-empleado', methods=['POST'])
def login_empleado():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"msg": "Email y contraseña son obligatorios"}), 400

    empleado = Empleado.query.filter_by(email=email).first()

    if empleado is None or empleado.password != password:
        return jsonify({"msg": "Credenciales incorrectas"}), 401

    access_token = create_access_token(identity=str(empleado.id))
    
    return jsonify({
        "token": access_token,
        "empleado": empleado.serialize()
    }), 200


@api.route('/my-bookings', methods=['GET'])
@jwt_required()
def get_my_bookings():
    """ Obtiene solo las reservas del cliente que tiene la sesión iniciada """
    try:
        client_id = get_jwt_identity()
        
        reservas = Reserva.query.filter_by(cliente_id=client_id).all()
        
        return jsonify([r.serialize() for r in reservas]), 200
    except Exception as e:
        return jsonify({"msg": "Error al obtener mis reservas", "error": str(e)}), 500

@api.route('/client/booking/<int:booking_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_my_booking(booking_id):
    client_id = int(get_jwt_identity())
    reserva = Reserva.query.filter_by(id=booking_id, cliente_id=client_id).first()
    
    if not reserva:
        return jsonify({"msg": "Reserva no encontrada"}), 404
    
    reserva.estado = "cancelada"
    db.session.commit()
    return jsonify({"msg": "Reserva cancelada correctamente"}), 200

@api.route('/update-client-image', methods=['PUT']) 
@jwt_required()
def update_client_image():
    identity = get_jwt_identity()
    body = request.get_json()
    image_url = body.get("image_url")
    
    
    user = Clients.query.get(identity)
    if user:
        user.image_url = image_url
        db.session.commit()
        return jsonify({"msg": "Imagen actualizada", "url": image_url}), 200
    
    return jsonify({"msg": "Usuario no encontrado"}), 404

