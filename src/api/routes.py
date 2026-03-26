"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Clients, Owner
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

@api.route('/clients', methods=['GET'])
def get_clients():

    all_clients = Clients.query.all()
    results = list(map(lambda client: client.serialize(), all_clients))

    return jsonify(results), 200

@api.route('/client/<int:client_id>', methods=['GET'])
def get_client(client_id):

    client = Clients.query.filter_by(id=client_id).first()

    if client is None:
        return jsonify({
            "error": "Client not found"
        }), 400

    return jsonify(client.serialize()), 200

@api.route('/client/<int:client_id>', methods=['DELETE'])
def delete_client(client_id):

    client = Clients.query.filter_by(id=client_id).first()
    if client is None:
        return jsonify({
            "error": "Client not found"
        }), 404
    
    db.session.delete(client)
    db.session.commit()

    return jsonify({"message": "client " + client.name + " deleted succesfully."}), 200

@api.route('/clients', methods=['POST'])
def create_client():

    body = request.get_json()
    client = Clients.query.filter_by(email=body['email']).first()
    
    if client:
        return jsonify({
            "error": "This email already exists"
        }), 401
    
    client = Clients(**body, is_active=True)
    db.session.add(client)
    db.session.commit()

    response_body = {
        "message": "New client created"
    }
    return jsonify(response_body), 200


@api.route('/client/<int:client_id>', methods=['PUT'])
def update_info_client(client_id):

    client = Clients.query.filter_by(id=client_id).first()
    body = request.get_json()
    if client is None:
        return jsonify({
            "error": "Client not found"
        }), 404
    client.name = body.get('name',client.name)
    client.email = body.get('email',client.email)
    client.phone = body.get('phone',client.phone)
    client.password = body.get('password',client.password)
   
    
    db.session.commit()

    return jsonify(client.serialize()), 200


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