from flask import Blueprint, make_response, jsonify, request
from flask_restful import Api, Resource, abort
from models.client import Client
from models.category import Category
from models.service import Service
# from server.models.invoice import Transaction
from models.user import User
from models.dbconfig import db


routes_bp = Blueprint('routes', __name__)
api = Api(routes_bp)


class Clients(Resource):
    def get(self):
        clients = [client.to_dict() for client in Client.query.all()]
        return {'clients': clients}, 200

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
            return {'message': 'Client created successfully', 'client': new_client.to_dict(rules=('-categories',))}, 201
        except Exception as e:
            db.session.rollback()
            return {'message': str(e)}, 500


class ClientsbyID(Resource):
    def patch(self, client_id):
        client = Client.query.filter(client_id=client_id).first().to_dict()
        if not client:
            return {'error': 'Client not found'}, 404
        
        data = request.get_json()
        for attr, value in data.items():
            if hasattr(client,attr):
                setattr(client, attr, value)
            else:
                return {'error': f'Invalid attribute: {attr}'}, 400
        db.session.commit()
        return (client.to_dict()), 200        


class Categories(Resource):
   def get(self):
       categories = [category.to_dict(rules=('-clients',)) for category in Category.query.all()]
       return categories, 200

class Services(Resource): 
   def get(self):
       services = [service.to_dict() for service in Service.query.all()]
       return services,200

class Transactions(Resource):
   def get(self):
       transactions = [transaction.to_dict() for transaction in Transaction.query.all()]
       return transactions, 200


class TransactionsbyID(Resource):
   def get(self, id):
       transaction = Transaction.query.filter(Transaction.transaction_id == id).first()
       return jsonify(transaction), 200


class Users(Resource):
   def get(self):
       users = [user.to_dict(rules='-clients',) for user in User.query.all()]
       return users, 200


api.add_resource(Clients, '/api/client/routes/clients', endpoint='clients')
api.add_resource(ClientsbyID, '/api/client/routes/clients/<int:id>')
api.add_resource(Categories, '/api/client/routes/categories', endpoint='categories')
api.add_resource(Services, '/api/client/routes/services', endpoint='services')
api.add_resource(Transactions, '/api/client/routes/transactions')
api.add_resource(TransactionsbyID, '/api/client/routes/transactions/<int:id>')
api.add_resource(Users, '/api/client/routes/users')









