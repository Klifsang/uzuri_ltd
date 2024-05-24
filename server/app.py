import os

from flask_migrate import Migrate
from flask import Flask, redirect, send_from_directory, url_for
from flask_bcrypt import Bcrypt

from flask_cors import CORS

import secrets
import datetime

# # from models.category import Category
# from models.client_service import Client_Service
# # from models.client import Client
# # from models.drilling_service import Drilling_Service
# # from models.plumbing_service import Plumbing_Service
# from models.pump_service import Pump_Service
# # from models.service import Service
# from models.user import User
# from models.transaction import Transaction
# from models.tank import Tank

from models.dbconfig import db

from routes.auth import auth_bp, jwt
from routes.admin.service_route import admin_service_bp
from routes.admin.client_routes import admin_client_bp
from routes.admin.category_route import admin_category_bp
from routes.client.routes import routes_bp




app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/dist',
    template_folder='../client/dist'
)

flask_secret_key = secrets.token_urlsafe(16)
jwt_secret_key = secrets.token_urlsafe(32)
print(jwt_secret_key)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = flask_secret_key
app.config['JWT_SECRET_KEY'] = jwt_secret_key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(minutes=30)

CORS(app)
db.init_app(app)
jwt.init_app(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)


@app.route('/', methods=['GET', 'POST'])
def index():
    return send_from_directory(app.static_folder, 'index.html')
# Catch-all route for handling unavailable routes
@app.errorhandler(404)
def page_not_found(e):
    return redirect(url_for('index'))



app.register_blueprint(auth_bp)

app.register_blueprint(admin_service_bp)
app.register_blueprint(admin_client_bp)
app.register_blueprint(admin_category_bp)
app.register_blueprint(routes_bp)



if __name__ == '__main__':
    app.run(debug=True,port=5000 )