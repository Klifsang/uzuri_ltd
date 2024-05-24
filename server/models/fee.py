from models.dbconfig import db
from models.plumbing_service import Plumbing_Service
from models.pump_service import Pump_Service
from models.tank import Tank
from models.drilling_service import Drilling_Service
from .depth_height_cost import DepthHeightCost
from .pump import Pump
from models.pipe import Pipe
from models.client import Client

class Fee(db.Model):
    __tablename__ = 'fees'

    id = db.Column(db.Integer, primary_key=True)
    client_Id = db.Column(db.Integer, db.ForeignKey('clients.client_id'))
    # client_type = db.Column(db.String, nullable=False)
    drilling_id = db.Column(db.Integer, db.ForeignKey('drillingservices.id'))
    drilling_downpayment= db.Column(db.Integer, nullable=False, default=0)

    pump_depth = db.Column(db.Integer, nullable=False)
    pump_height = db.Column(db.Integer, nullable=False)
    pump_cost = db.Column(db.Integer, nullable=False, default=0)
    pump_id = db.Column(db.Integer, db.ForeignKey('pumps.id'))
    pumptype_cost=db.Column(db.Integer, nullable=False, default=0)

    pipe_diameter = db.Column(db.Integer, nullable=False)
    pipe_length = db.Column(db.Integer, nullable=False)
    number_of_outlets = db.Column(db.Integer, nullable=False)
    plumbing_cost = db.Column(db.Integer, nullable=False, default=0)
    pipe_id = db.Column(db.Integer, db.ForeignKey('pipes.id'))
    pipe_cost=db.Column(db.Integer, nullable=False, default=0)

    tank_capacity = db.Column(db.Integer, nullable=False)
    tank_cost = db.Column(db.Integer, nullable=False, default=0)

    total_cost = db.Column(db.Integer, nullable=False, default=0)
    tax_amount = db.Column(db.Integer, nullable=False, default=0)
    local_fee = db.Column(db.Integer, nullable=False, default=0)
    survey_fee = db.Column(db.Integer, nullable=False, default=0)

    # Relationships
    client = db.relationship('Client', back_populates='fees')
    drillingservice = db.relationship('Drilling_Service', back_populates='fees')
    pump = db.relationship('Pump', back_populates='fees')
    pipe = db.relationship('Pipe', back_populates='fees')
    # invoice = db.relationship('Invoice', back_populates='fee', uselist=False)

    def calculate_pump_cost(self):
        depth_cost = DepthHeightCost.query.filter(
            DepthHeightCost.min_depth_height <= self.pump_depth,
            DepthHeightCost.max_depth_height >= self.pump_depth
        ).first()
        height_cost = DepthHeightCost.query.filter(
            DepthHeightCost.min_depth_height <= self.pump_height,
            DepthHeightCost.max_depth_height >= self.pump_height
        ).first()

        if not depth_cost or not height_cost:
            raise ValueError("Depth or height out of range")

        pump = Pump.query.get(self.pump_id)
        if not pump:
            raise ValueError("Pump not found")
        
        self.pumptype_cost = pump.cost

        total_cost = self.pump_depth * depth_cost.cost_per_meter + self.pump_height * height_cost.cost_per_meter + self.pumptype_cost
        return total_cost

    def update_pump_cost(self):
        self.pump_cost = self.calculate_pump_cost()

    def calculate_plumbing_cost(self):
        outlets_cost = 40
        diameter_cost = 20
        length_cost = 30

        pipetype = Pipe.query.get(self.pipe_id)
        if not pipetype:
            raise ValueError("PipeType not found")
        
        self.pipe_cost=pipetype.pipe_cost

        outlet_amount = outlets_cost * self.number_of_outlets
        diameter_amount = diameter_cost * self.pipe_diameter
        length_amount = length_cost * self.pipe_length
        total_cost = outlet_amount + diameter_amount + length_amount + self.pipe_cost

        return total_cost

    def update_plumbing_cost(self):
        self.plumbing_cost = self.calculate_plumbing_cost()

    def calculate_tank_cost(self):
        price_per_liter = 40
        total_cost = self.tank_capacity * price_per_liter
        return total_cost

    def update_tank_cost(self):
        self.tank_cost = self.calculate_tank_cost()

    def calculate_total_cost(self):
        drillingservice = Drilling_Service.query.get(self.drilling_id)
        if not drillingservice:
            raise ValueError("DrillingService not found")
        
        client = Client.query.get(self.client_Id)
        if not client:
            raise ValueError("Client not found")
        
        category = client.category
        if not category:
            raise ValueError("Category not found")

        
        self.local_fee = category.cat_localfee
        self.survey_fee = category.cat_surveyfee
        self.drilling_downpayment= drillingservice.downpayment
        

        # Ensure all individual costs are updated
        self.update_pump_cost()
        self.update_plumbing_cost()
        self.update_tank_cost()

        subtotal = self.drilling_downpayment + self.pump_cost + self.plumbing_cost + self.tank_cost + self.local_fee + self.survey_fee
        tax = int(subtotal * 0.16)
        self.total_cost = subtotal + tax
        self.tax_amount = tax
        return self.total_cost

    def update_total_cost(self):
        self.total_cost = self.calculate_total_cost()

    def to_dict(self):
        return {
            'id': self.id,
            'client_Id': self.client_Id,
            # 'client_type': self.client_type,
            'drilling_id': self.drilling_id,
            'drilling_downpayment': self.drilling_downpayment,
            'pump_id': self.pump_id,
            'pumptype_cost':self.pumptype_cost,
            'pump_depth': self.pump_depth,
            'pump_height': self.pump_height,
            'pipe_id': self.pipe_id,
            'pipe_cost':self.pipe_cost,
            'pipe_diameter': self.pipe_diameter,
            'pipe_length': self.pipe_length,
            'number_of_outlets': self.number_of_outlets,
            'tank_capacity': self.tank_capacity,
            'pump_cost': self.pump_cost,
            'plumbing_cost': self.plumbing_cost,
            'tank_cost': self.tank_cost,
            'total_cost': self.total_cost,
            'tax_amount': self.tax_amount,
            'local_fee':self.local_fee,
            'survey_fee':self.survey_fee
        }

    def __repr__(self):
        return f'<Fee {self.id}, Client {self.client_Id}, Total Cost {self.total_cost}>'
