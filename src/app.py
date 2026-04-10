import os
from datetime import timedelta 
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from flask_jwt_extended import JWTManager 

from api.utils import APIException, generate_sitemap
from api.models import db, Restaurante  ### 1. IMPORTANTE: Importa tu modelo Restaurante aquí
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

# 2. Importa la lógica de la IA (está en la misma carpeta src que app.py)
from ai_handler import obtener_recomendacion_conserje

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../dist/')

app = Flask(__name__)
app.url_map.strict_slashes = False

app.config["JWT_SECRET_KEY"] = "super-secret-key" 
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24) 
jwt = JWTManager(app)

# Database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'test.db')

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Setup CORS
CORS(app, resources={r"/*": {"origins": "*"}})

MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

setup_admin(app)
setup_commands(app)
app.register_blueprint(api, url_prefix='/api')

### 3. EL NUEVO ENDPOINT DEL CONSERJE ###
@app.route('/api/conserje', methods=['POST'])
def conserje_ia():
    try:
        body = request.get_json()
        pregunta_usuario = body.get("query")
        
        if not pregunta_usuario:
            return jsonify({"msg": "Escribe algo para el conserje"}), 400
        
        # Obtenemos los restaurantes de la DB
        restaurantes = Restaurante.query.all()
        
        # Simplificamos la data para Gemini
        data_para_ia = [
            {
                "nombre": r.name, 
                "categoria": r.category, 
                "tags": r.tags
            } for r in restaurantes
        ]
        
        # Llamamos a la función de ai_handler
        respuesta = obtener_recomendacion_conserje(pregunta_usuario, data_para_ia)
        
        return jsonify({"respuesta": respuesta}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)