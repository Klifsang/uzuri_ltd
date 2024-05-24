from .dbconfig import db
from sqlalchemy_serializer import SerializerMixin
from .depth_height_cost import DepthHeightCost
from .pump import Pump
from .service import Service

class Pump_Service(db.Model, SerializerMixin):
    __tablename__ = 'pumpservices'

    serialize_rules = ('-service.pumpservices', '-pumps.pumpservice')

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    depth = db.Column(db.Integer, nullable=False)
    height = db.Column(db.Integer, nullable=False)
    pump_cost = db.Column(db.Integer, nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.service_id'))
    pump_id = db.Column(db.Integer, db.ForeignKey('pumps.id'))

    service = db.relationship('Service', back_populates='pumpservices')
    pumps = db.relationship('Pump', back_populates='pumpservice')
    # fees = db.relationship('Fee', back_populates='pumpservice')

    def __repr__(self):
        return f'<Pump_Service {self.id}, Pump {self.pump_id}, Service {self.service_id}>'

    def calculate_cost(self):
        depth_cost = DepthHeightCost.query.filter(
            DepthHeightCost.min_depth_height <= self.depth,
            DepthHeightCost.max_depth_height >= self.depth
        ).first()
        height_cost = DepthHeightCost.query.filter(
            DepthHeightCost.min_depth_height <= self.height,
            DepthHeightCost.max_depth_height >= self.height
        ).first()

        if not depth_cost or not height_cost:
            raise ValueError("Depth or height out of range")

        pump = Pump.query.get(self.pump_id)
        if not pump:
            raise ValueError("Pump not found")

        total_cost = self.depth * depth_cost.cost_per_meter + self.height * height_cost.cost_per_meter + pump.cost
        return total_cost

    def update_cost(self):
        self.pump_cost = self.calculate_cost()
