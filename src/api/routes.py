"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Host
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/host', methods=['GET'])
def get_hosts():
    hosts = Host.query.all()
    print(hosts)
    respuesta = list(map(lambda host: host.serialize(), hosts))
    return jsonify(respuesta), 200

@api.route('/host/<int:host_id>', methods=['GET'])
def get_host(host_id):
    host = Host.query.filter_by(id=host_id).first()
    # print(host.serialize())
    if host is None:
        return jsonify({
            "message": "no se encontro el host con el id: " + str(host_id)
        })
    return jsonify(host.serialize()), 200

@api.route('/host/<int:host_id>', methods=['DELETE'])
def delete_host(host_id):
    host = Host.query.filter_by(id=host_id).first()
    if host is None:
        return {
            "message": "no se encontro el host con el id: " + str(host_id)
        },400
    print(host.serialize())
    db.session.delete(host)
    db.session.commit()
    response_body = {
        "message": "se elimino el host"
    }

    return jsonify(response_body), 200

@api.route('/host', methods=['POST'])
def add_host():
    body = request.get_json()
    host = Host.query.filter_by(email=body["email"]).first()
    if host is not None:
        return jsonify({
            "message": "ya esta creado el host con el email: " + body["email"]
        }),400
    host = Host(
        first_name=body["first_name"],
        email=body["email"],
        last_name=body["last_name"],
        phone_number=body["phone_number"],
        special_notes=body["special_notes"],
        total_visits=body["total_visits"],
        last_visit=body["last_visit"],
        password=body["password"]
        )
    db.session.add(host)
    db.session.commit()
    response_body = {
        "message": "se creo el host",
        "host": host.serialize()
    }

    return jsonify(response_body), 200

@api.route('/host/<int:host_id>', methods=['PUT'])
def update_host(host_id):
    host = Host.query.filter_by(id=host_id).first()
    body = request.get_json()

    if host is None:
        return jsonify({
            "message": "no se encontro el host con el id: " + str(host_id)
        }),400
    
    if "first_name" in body:
        host.first_name = body ["first_name"]

    if "last_name" in body:
        host.last_name = body ["last_name"]

    if "phone_number" in body:
        host.phone_number = body ["phone_number"]

    if "email" in body:
        host.email = body ["email"]

    if "special_notes" in body:
        host.special_notes = body ["special_notes"]
    
    if "total_visits" in body:
        host.total_visits = body ["total_visits"]

    db.session.commit()
    response_body = {
        "message": "se actualizo el host",
        "host": host.serialize()
    }

    return jsonify(response_body), 200