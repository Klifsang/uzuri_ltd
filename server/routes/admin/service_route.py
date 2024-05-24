from datetime import datetime
from flask import Blueprint, make_response, jsonify, request
from flask_restful import Api, Resource, abort
# from flask_jwt_extended import jwt_required, get_jwt_identity

from server.models.service import Service
from server.models.dbconfig import db
from server.models.drilling_service import Drilling_Service
from server.models.plumbing_service import Plumbing_Service
from server.models.tank import Tank
from server.models.pump_service import Pump_Service
from server.models.category import Category
from server.models.invoice import Invoice
from server.models.user import User
from server.models.pump import Pump
from server.models.depth_height_cost import DepthHeightCost
from server.models.pipe import Pipe
from server.models.fee import Fee
from server.models.client import Client

admin_service_bp = Blueprint('admin_service', __name__)
api = Api(admin_service_bp)



# Resource for drilling services
class DrillingServices(Resource):

    def get(self):
        drilling_services = [drilling_service.to_dict(rules=('-service',)) for drilling_service in Drilling_Service.query.all()]
        response = make_response(jsonify(drilling_services), 200)
        return response
    def post(self):  
        data = request.get_json()

        new_drilling_service = Drilling_Service(
            drill_type = data['drill_type'],
            downpayment = data['downpayment'],
            image = data['image'],
            service_id = data['service_id']
        )
        db.session.add(new_drilling_service)
        db.session.commit()
        response = make_response(jsonify(new_drilling_service.to_dict(rules=('-service',))),201)
        return response
    
    def patch(self, id):
        drilling_service = Drilling_Service.query.filter_by(id=id).first()
        if not drilling_service:
            return make_response(jsonify({"message": "Drilling service not found"}), 404)
        
        data = request.json
        # Update client attributes based on the provided data
        for key, value in data.items():
            setattr(drilling_service, key, value)
        
        db.session.commit()
        return make_response(jsonify(drilling_service.to_dict(rules=('-service',))), 200)

    def delete(self, id):
        drilling_service = Drilling_Service.query.filter_by(id=id).first()
        if not drilling_service:
            return make_response(jsonify({"message": "Drilling service not found"}), 404)
        
        db.session.delete(drilling_service)
        db.session.commit()
        
        return make_response(jsonify({"message": "Drilling service deleted successfully"}), 200)


api.add_resource(DrillingServices, '/api/admin/routes/drillingservices/<int:id>', endpoint='drillingservices_by_id')  
api.add_resource(DrillingServices, '/api/admin/routes/drillingservices', endpoint='drillingservices')


# Resource for plumbing services
class PlumbingServices(Resource):
    def get(self, id=None):
        if id is None: 
            plumbing_services = [plumbing_service.to_dict(rules=('-service',)) for plumbing_service in Plumbing_Service.query.all()]
            response = make_response(jsonify(plumbing_services), 200)
            return response
        else:
            plumbing_services = [plumbing_service.to_dict(rules=('-service',)) for plumbing_service in Plumbing_Service.query.filter_by(id=id)]
            response = make_response(jsonify(plumbing_services), 200)
            return response
        
    def post(self):
        data = request.get_json()

        new_plumbing_service = Plumbing_Service(
            pipe_type = data['pipe_type'],
            type_cost = data['type_cost'],
            diameter_cost = data['diameter_cost'],
            length_cost = data['length_cost'],
            pipe_diameter = data['pipe_diameter'],
            pipe_length = data['pipe_length'],
            outlets = data['outlets'],
            outlets_cost = data['outlets_cost'],
            service_id = data['service_id'],
            pipe_id = data ['pipe_id']
        )
        new_plumbing_service.update_cost() 
        db.session.add(new_plumbing_service)
        db.session.commit()
        return (new_plumbing_service.to_dict(rules=('-service',))), 201
    
    def patch(self,id):
        plumbing_service = Plumbing_Service.query.filter_by(id=id).first()
        if not plumbing_service:
            return make_response(jsonify({"message": "Plumbing service not found"}), 404)
        
        data = request.json
        # Update client attributes based on the provided data
        for key, value in data.items():
            setattr(plumbing_service, key, value)
        
        db.session.commit()
        return make_response(jsonify(plumbing_service.to_dict(rules=('-service',))), 200)
    
    def delete(self, id):
        plumbing_Service = Plumbing_Service.query.filter_by(id=id).first()
        if not Plumbing_Service:
            return make_response(jsonify({"message": "Plumbing service not found"}), 404)
        
        db.session.delete(plumbing_Service)
        db.session.commit()
        
        return make_response(jsonify({"message": "Plumbing service deleted successfully"}), 200)

api.add_resource(PlumbingServices, '/api/admin/routes/plumbingservices', endpoint='plumbingservices')
api.add_resource(PlumbingServices, '/api/admin/routes/plumbingservices/<int:id>', endpoint='plumbingservices_by_id')


# Tank services
class TankServices(Resource):
    def get(self, tank_id=None):
        if tank_id is None:
            tanks = Tank.query.all()
            return make_response(jsonify([tank.to_dict(rules=('-service',)) for tank in tanks]), 200)
        else:
            tank = Tank.query.filter_by(tank_id=tank_id).first()
            return make_response(jsonify(tank.to_dict(rules=('-service',))),200)

    def post(self):
        data = request.get_json()
        tank_name = data.get('tank_name')
        capacity = data.get('capacity')
        price_per_liter = data.get('price_per_liter')
        service_id = data.get('service_id')
        image = data.get('image')

        if not all([capacity, service_id, image]):
            return jsonify({'error': 'Missing required fields'}), 400

        tank = Tank(tank_name=tank_name, capacity=capacity, price_per_liter=price_per_liter, image=image, service_id=service_id)
        tank.update_cost()
        db.session.add(tank)
        db.session.commit()
        return make_response(jsonify([tank.to_dict(rules=('-service',))]), 201)
    
    def patch(self,tank_id):
        tank = Tank.query.filter_by(tank_id=tank_id).first()
        if not tank:
            return make_response(jsonify({"message": "Plumbing service not found"}), 404)
        
        data = request.json
        for key, value in data.items():
            setattr(tank, key, value)
        
        db.session.commit()
        return make_response(jsonify(tank.to_dict(rules=('-service',))), 200)
    
    def delete(self, tank_id):
        tank = Tank.query.filter_by(tank_id=tank_id).first()
        if not tank:
            return make_response(jsonify({"message": "Tank not found"}), 404)
        
        db.session.delete(tank)
        db.session.commit()
        
        return make_response(jsonify({"message": "Tank deleted successfully"}), 200)

api.add_resource(TankServices, '/api/admin/routes/tank', endpoint='tank')
api.add_resource(TankServices, '/api/admin/routes/tank/<int:tank_id>', endpoint='tank_by_id')


# Pump services
class PumpServices(Resource):
    def get(self,id=None):
        if id is None:
            pumpservices = [pumpservice.to_dict(rules=('-service',)) for pumpservice in Pump_Service.query.all()]
            return pumpservices,200
        else:
            pumpservice = Pump_Service.query.filter_by(id=id).first()
            return make_response(pumpservice.to_dict(rules=('-service',)),200)
        
    def post(self):
        data = request.get_json()

        # Retrieve pump details
        # pumpservices = Pump_Service.query.filter_by(id=data['pump_id']).first()
        # if not pumpservices:
        #     return make_response(jsonify({"error": "Pump not found"}), 404)

        # Create new Pump_Service instance
        new_pump_service = Pump_Service(
            depth=data['depth'],
            height=data['height'],
            service_id=data['service_id'],
            pump_id=data['pump_id']
        )

        # Calculate and update the total cost
        try:
            new_pump_service.update_pump_cost()
        except ValueError as e:
            return make_response(jsonify({"error": str(e)}), 400)

        # Add and commit the new Pump_Service to the database
        db.session.add(new_pump_service)
        db.session.commit()

        return make_response((new_pump_service.to_dict()), 201)


    def patch(self,id):
        pump = Pump_Service.query.filter_by(id=id).first()
        if not pump:
            return make_response(jsonify({"message": "Pump service not found"}), 404)
        
        data = request.json
        # Update client attributes based on the provided data
        for key, value in data.items():
            setattr(pump, key, value)
        
        db.session.commit()
        return make_response(jsonify(pump.to_dict(rules=('-service',))), 200)
    
    def delete(self, id):
        pump = Pump_Service.query.filter_by(id=id).first()
        if not pump:
            return make_response(jsonify({"message": "Pump not found"}), 404)
        
        db.session.delete(pump)
        db.session.commit()
        
        return make_response(jsonify({"message": "Pump deleted successfully"}), 200)

api.add_resource(PumpServices, '/api/admin/routes/pumpservices', endpoint='pumpservices')
api.add_resource(PumpServices, '/api/admin/routes/pumpservices/<int:id>', endpoint='pumpservices_by_id')


class Categories(Resource):
   def get(self):
       categories = [category.to_dict(rules=('-clients',)) for category in Category.query.all()]
       return categories, 200

class Services(Resource): 
    def get(self, service_id=None):
        if service_id is None:
            services = [service.to_dict() for service in Service.query.all()]
            return services,200
        else:
            service = [service.to_dict() for service in Service.query.filter_by(service_id=service_id)]
            # response = make_response(jsonify(service), 200)
            return service,200
        
    def post(self):
        data = request.get_json()

        new_service = Service(
            service_name = data['service_name']
        )
        db.session.add(new_service)
        db.session.commit()
        response = make_response(jsonify(new_service.to_dict(rules=('-tanks', '-clientservices','-plumbingservices','-drillingservices', '-pumpservices'))), 201)
        return response
    
    def patch(self, service_id):
        service = Service.query.filter_by(service_id=service_id).first()
        if not service:
            return make_response(jsonify({"message": "Service not found"}), 404)
        
        data = request.json
        # Update client attributes based on the provided data
        for key, value in data.items():
            setattr(service, key, value)
        
        db.session.commit()
        return make_response(jsonify({"message": "Service has been updated successfully"}), 200)
    
    def delete(self, service_id):
        service = Service.query.filter_by(service_id=service_id).first()
        if not service:
            return make_response(jsonify({"message": "Service not found"}), 404)
        
        db.session.delete(service)
        db.session.commit()
        
        return make_response(jsonify({"message": "Service deleted successfully"}), 200)

class Invoices(Resource):
   def get(self):
       invoices = [invoice.to_dict() for invoice in Invoice.query.all()]
       return invoices, 200
   
   def post(self):
        data = request.get_json()

            # Convert the date string to a datetime.date object
        date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    
        new_invoice = Invoice(
            client_id=data['client_id'],
            # fee_id=data['fee_id'],
            client_name = data['client_name'],
            email = data['email'],
            client_category=data['client_category'],
            invoice_number = data['invoice_number'],
            date = date,
            project_status = data['project_status'],
            drilling_name = data['drilling_name'],
            pump_name = data['pump_name'],
            pipe_name = data['pipe_name'],
            pipe_diameter = data['pipe_diameter'],
            pipe_length = data['pipe_length'],
            number_of_outlets = data['number_of_outlets'],
            tank_capacity = data['tank_capacity'],
            total_cost_before_tax = data['total_cost_before_tax'],
            tax_amount = data['tax_amount'],
            total_cost_after_tax = data['total_cost_after_tax']
        )
        db.session.add(new_invoice)
        db.session.commit()

        return new_invoice.to_dict(), 201


class InvoicesbyID(Resource):
   def get(self, id):
       invoice = Invoice.query.filter(Invoice.id == id).first()
       return invoice, 200
   
class Users(Resource):
   def get(self):
       users = [user.to_dict(rules='-clients',) for user in User.query.all()]
       return users, 200
   
   def post(self):
        data = request.get_json()

        new_user = User(
        username=data['username'],
        email=data['email'],
        password=data['password']
    )


        db.session.add(new_user)
        db.session.commit()
        return (new_user.to_dict(rules=('-service',))), 201
   
class Pipes(Resource):
    def get(self):
        pipes = [pipe.to_dict() for pipe in Pipe.query.all()]
        return pipes, 200
   
    def post(self):
        data = request.get_json()


        new_pipe = Pipe(
            pipe_name = data['pipe_name'],
            pipe_cost = data['pipe_cost']
        )
        db.session.add(new_pipe)
        db.session.commit()
        return (new_pipe.to_dict()),201
   
    def patch(self, id):
        pipe = Pipe.query.filter_by(id=id).first()
        if not pipe:
            return make_response(jsonify({"message": "Pipe not found"}), 404)
       
        data = request.json
        # Update client attributes based on the provided data
        for key, value in data.items():
            setattr(pipe, key, value)
       
        db.session.commit()
        return make_response(jsonify({"message": "Pipe has been updated successfully"}), 200)
   
    def delete(self, id):
        pipe = Pipe.query.filter_by(id=id).first()
        if not pipe:
            return make_response(jsonify({"message": "Pipe not found"}), 404)
       
        db.session.delete(pipe)
        db.session.commit()
       
        return make_response(jsonify({"message": "Pipe deleted successfully"}), 200)

    

class Pumps(Resource):
    def get(self):
        pumps = [pump.to_dict() for pump in Pump.query.all()]
        return pumps, 200
   
    def post(self):
        data = request.get_json()


        new_pump = Pump(
            pump_name = data['pump_name'],
            cost = data['cost']
        )
        db.session.add(new_pump)
        db.session.commit()
        return (new_pump.to_dict()),201
   


    def patch(self, id):
        pump = Pipe.query.filter_by(id=id).first()
        if not pump:
            return make_response(jsonify({"message": "Pump not found"}), 404)
       
        data = request.json
        # Update client attributes based on the provided data
        for key, value in data.items():
            setattr(pump, key, value)
       
        db.session.commit()
        return make_response(jsonify({"message": "Pump has been updated successfully"}), 200)
   
    def delete(self, id):
        pipe = Pipe.query.filter_by(id=id).first()
        if not pipe:
            return make_response(jsonify({"message": "Pump not found"}), 404)
       
        db.session.delete(pump)
        db.session.commit()
       
        return make_response(jsonify({"message": "Pump deleted successfully"}), 200)
    
class DepthHeightCosts(Resource):
    def get(self):
        depth_height_costs = [depth_height_cost.to_dict() for depth_height_cost in DepthHeightCost.query.all()]
        return depth_height_costs, 200
   

class Fees(Resource):
    def get(self):
        fees = [fee.to_dict() for fee in Fee.query.all()]
        return fees, 200

    def post(self):
        data = request.get_json()

        new_fee = Fee(
            client_Id=data['client_Id'],
            # client_type = data['client_type'],
            drilling_id=data['drilling_id'],
            pump_id=data['pump_id'],
            pump_depth=data['pump_depth'],
            pump_height=data['pump_height'],
            pipe_id=data['pipe_id'],
            pipe_diameter=data['pipe_diameter'],
            pipe_length=data['pipe_length'],
            number_of_outlets=data['number_of_outlets'],
            tank_capacity=data['tank_capacity']
            
        )

        new_fee.update_total_cost()

        db.session.add(new_fee)
        db.session.commit()

        return new_fee.to_dict(), 201




api.add_resource(Categories, '/api/admin/routes/categories', endpoint='categories')
api.add_resource(Services, '/api/admin/routes/services', endpoint='services')
api.add_resource(Services, '/api/admin/routes/services/<int:service_id>',endpoint='service_by_id')
api.add_resource(Invoices, '/api/admin/routes/invoices')
api.add_resource(InvoicesbyID, '/api/admin/routes/invoices/<int:id>')
api.add_resource(Users, '/api/admin/routes/users')
api.add_resource(Pipes, '/api/admin/routes/pipes', endpoint='pipes')
api.add_resource(Pipes, '/api/admin/routes/pipes/<int:id>', endpoint='pipesbyID')
api.add_resource(Pumps, '/api/admin/routes/pumps', endpoint='pumps')
api.add_resource(Pumps, '/api/admin/routes/pumps/<int:id>', endpoint='pumpsbyID')
api.add_resource(DepthHeightCosts, '/api/admin/routes/depthheight', endpoint='depthheight')
api.add_resource(Fees, '/api/admin/routes/fees')