from flask import Blueprint, make_response, jsonify, request
from flask_restful import Api, Resource, abort
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, get_jwt, current_user, create_access_token, decode_token
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
import uuid

from server.models.dbconfig import db
from server.models.user import User
from server.models.token_blocklist import TokenBlocklist

auth_bp = Blueprint('auth', __name__)
jwt = JWTManager()
api = Api(auth_bp)

def generate_jti():
    # Generate a unique JTI using UUID
    return str(uuid.uuid4())


# @jwt.user_lookup_loader
# def user_lookup_callback(_jwt_header, jwt_data):
#     identity = jwt_data.get("sub")
#     if identity is not None:
#         return User.query.get(identity)
#     return None

# @jwt.token_in_blocklist_loader
# def check_if_token_is_revoked(jwt_header, jwt_payload: dict):
#     jti = jwt_payload["jti"]
#     token = db.session.query(TokenBlocklist).filter_by(jti=jti).first()
#     return token is not None


# class ClientRegistration(Resource):
#     def get(self):
#         users = User.query.all()
#         return make_response(jsonify(users))
    
#     def post(self):
#         data = request.get_json()
#         username = data.get('username')
#         email = data.get('email')
#         password = data.get('password')
#         hashed = generate_password_hash(password, method='pbkdf2:sha256')

#         new_user = User(username=username, email=email, password=hashed,role="Client")
#         db.session.add(new_user)
#         db.session.commit()

#         response_body = {'detail': f'User {username} has been created successfully'}
#         return make_response(jsonify(response_body), 201)
    
# api.add_resource(ClientRegistration, '/api/auth/client_signup', endpoint='client_signup')

# class ClientAuthentication(Resource):
#     def get(self):
#         current_user_id = get_jwt_identity()
#         user = User.query.get(current_user_id)
#         if not user:
#             return abort(404, message="Invalid credentials")
#         response_body = {"username": user.username, "user_id": user.user_id}
#         return make_response(jsonify(response_body), 200)
        
#     def post(self):
#         data = request.get_json()
#         username = data.get('username')
#         password = data.get('password')

#         user = User.query.filter_by(username=username).first()
#         if not user:
#             return abort(404, message="Wrong credentials") 
#         if not check_password_hash(user.password, password):
#             return abort(404, message="Wrong credentials")
        
#         jti = generate_jti()

#         token = create_access_token(identity={'user_id': user.user_id, 'role': user.role})
#         token_payload = decode_token(token)
#         token_payload['jti'] = jti
#         token_with_jti = create_access_token(identity=token_payload)

#         response_body = {"access_token": token_with_jti, "username": user.username, "user_id": user.user_id,"role": user.role}
#         return make_response(jsonify(response_body), 200)

# api.add_resource(ClientAuthentication, '/api/auth/client_login', endpoint='client_login')


class AdminRegistration(Resource):
    def get(self):
        users = User.query.all()
        return make_response(jsonify(users))
    def post(self):
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        hashed = generate_password_hash(password, method='pbkdf2:sha256')

        new_user = User(username=username, email=email, password=hashed)
        db.session.add(new_user)
        db.session.commit()

        response_body = {'detail': f'User {username} has been created successfully'}
        return make_response(jsonify(response_body), 201)
    
api.add_resource(AdminRegistration, '/api/auth/admin_signup', endpoint='admin_signup')

class AdminAuthentication(Resource):
    
    def get(self):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user:
            return abort(404, message="Invalid credentials")
        response_body = {"username": user.username, "id": user.id}
        return make_response(jsonify(response_body), 200)
        
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()
        if not user:
            return abort(404, message="Wrong credentials") 
        if not check_password_hash(user.password, password):
            return abort(404, message="Wrong credentials")
        
        jti = generate_jti()

        token = create_access_token(identity=user.id)
        token_payload = decode_token(token)
        token_payload['jti'] = jti
        token_with_jti = create_access_token(identity=token_payload)

        response_body = {"access_token": token_with_jti, "email": user.email, "id": user.id}
        return (response_body), 200

api.add_resource(AdminAuthentication, '/api/auth/admin_login', endpoint='admin_login')


class UserLogout(Resource):
    @jwt_required()
    def post(self):
        token = get_jwt()
        blocked_token = TokenBlocklist(jti=token['jti'], created_at=datetime.datetime.utcnow())
        db.session.add(blocked_token)
        db.session.commit()
        response_body = {"message": "User logged out"}
        return make_response(jsonify(response_body),200)
    
api.add_resource(UserLogout, '/api/auth/logout', endpoint='logout')


        