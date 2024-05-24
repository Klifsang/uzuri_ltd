from flask import Blueprint, make_response, jsonify, request
from flask_restful import Api, Resource, abort

from models.dbconfig import db
from models.client import Client
from models.category import Category

admin_client_bp = Blueprint('admin_client', __name__)
api = Api(admin_client_bp)





class Clients(Resource):
    def get(self, client_id=None):
        if client_id is None:
            clients = Client.query.all()
            response = make_response(jsonify([client.to_dict(rules=('-category',)) for client in clients]), 200)
            return response
        else:
            client = Client.query.filter_by(client_id=client_id).first()
            return make_response(jsonify(client.to_dict()))
        
    def post(self):
        data = request.get_json()

        # Validate incoming data
        required_fields = ['firstName', 'lastName', 'email', 'address', 'phone_number', 'location', 'category_id']
        if not all(field in data for field in required_fields):
            return {'message': 'Missing required fields'}, 400

        try:
            new_client = Client(
                firstName=data['firstName'],
                lastName=data['lastName'],
                email=data['email'],
                address=data['address'],
                phone_number=data['phone_number'],
                location=data['location'],
                category_id=data['category_id'],
            )
            db.session.add(new_client)
            db.session.commit()
            return {'message': 'Client created successfully', 'client': new_client.to_dict(rules=('-category',))}, 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 500
        
class ClientsbyID(Resource):
    def get(self, client_id):
        client = Client.query.filter_by(client_id=client_id).first()
        if not client:
            return make_response(jsonify({"message": "Client not found"}), 404)
        else:
            return (client.to_dict(rules=('-category',))), 200
            

    def patch(self, client_id):
        client = Client.query.filter_by(client_id=client_id).first()
        if not client:
            return make_response(jsonify({"message": "Client not found"}), 404)
            
        data = request.json
            # Update client attributes based on the provided data
        for key, value in data.items():
            setattr(client, key, value)
            
        db.session.commit()
        return make_response(jsonify(client.to_dict(rules=('-user',))), 200)
        
    def delete(self, client_id):
        client = Client.query.filter_by(client_id=client_id).first()
        if not client:
            return make_response(jsonify({"message": "Client not found"}), 404)
            
        db.session.delete(client)
        db.session.commit()
            
        return make_response(jsonify({"message": "Client deleted successfully"}), 200)

api.add_resource(Clients, '/api/admin/routes/clients', endpoint='clients')
api.add_resource(ClientsbyID, '/api/admin/routes/clients/<int:client_id>', endpoint='client_by_id')