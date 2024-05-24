from flask import Blueprint, make_response, jsonify, request
from flask_restful import Api, Resource, abort

from models.dbconfig import db
from models.fee import Fee

fee_bp = Blueprint('fee', __name__)
api = Api(fee_bp)

class FeeResource(Resource):
    def get(self, id=None):
        if id is None:
            fees = Fee.query.all()
            return jsonify([fee.to_dict() for fee in fees])
        fee = Fee.query.get(id)
        if fee is None:
            abort(404, message="Fee not found")
        return jsonify(fee.to_dict())

    def post(self):
        data = request.get_json()
        fee = Fee(**data)
        db.session.add(fee)
        db.session.commit()
        return jsonify(fee.to_dict()), 201

    def patch(self, id):
        data = request.get_json()
        fee = Fee.query.get(id)
        if fee is None:
            abort(404, message="Fee not found")
        for key, value in data.items():
            setattr(fee, key, value)
        db.session.commit()
        return jsonify(fee.to_dict())

    def delete(self, id):
        fee = Fee.query.get(id)
        if fee is None:
            abort(404, message="Fee not found")
        db.session.delete(fee)
        db.session.commit()
        return '', 204

# Utility method to convert Fee model to dictionary
def fee_to_dict(fee):
    return {
        "id": fee.id,
        "client_id": fee.client_id,
        "client_type": fee.client_type,
        "drilling_service": fee.drilling_service,
        "pump_type": fee.pump_type,
        "pump_depth": fee.pump_depth,
        "pump_height": fee.pump_height,
        "pipe_types": fee.pipe_types,
        "pipe_diameter": fee.pipe_diameter,
        "pipe_length": fee.pipe_length,
        "number_of_outlets": fee.number_of_outlets,
        "other_services": fee.other_services,
        "tank_capacity": fee.tank_capacity,
        "total_cost": fee.total_cost,
        "tax_amount": fee.tax_amount
    }


Fee.to_dict = fee_to_dict

api.add_resource(FeeResource, '/api/admin/routes/fees', '/api/admin/routes/fees/<int:id>')
