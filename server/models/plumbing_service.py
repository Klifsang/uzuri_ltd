from .dbconfig import db
from sqlalchemy_serializer import SerializerMixin

class Plumbing_Service(db.Model,SerializerMixin):
    __tablename__ = 'plumbingservices'

     #serialization
    serialize_rules=('-service.plumbingservices','-pipes.plumbingservice')

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    pipe_type = db.Column(db.String, nullable=False)
    type_cost = db.Column(db.String, nullable=False)
    pipe_diameter = db.Column(db.Integer,nullable=False)
    # diameter_cost = db.Column(db.Integer, nullable=False)
    pipe_length = db.Column(db.Integer,nullable=False)
    # length_cost = db.Column(db.Integer, nullable=False)
    outlets = db.Column(db.Integer,nullable=False)
    # outlets_cost = db.Column(db.Integer, nullable=False)
    plumbing_cost = db.Column(db.Integer,nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.service_id'))
    pipe_id = db.Column(db.Integer, db.ForeignKey('pipes.id'))

    #One to many relationship between plumbing services and service
    service = db.relationship('Service', back_populates='plumbingservices')
    pipes = db.relationship('Pipe', back_populates='plumbingservice')
    # fees = db.relationship('Fee', back_populates='plumbingservice')

    def __repr__(self):
        return f'<Plumbing_Service {self.id}, {self.drill_type}>'
    
    def calculate_cost(self):
        outlets_cost = int(40)
        diameter_cost = int(20)
        length_cost = int(30)


        pipe_amount = self.type_cost
        outlet_amount = outlets_cost * self.outlets
        diameter_amount = diameter_cost * self.pipe_diameter
        length_amount = length_cost * self.pipe_length
        total_cost = outlet_amount + diameter_amount + length_amount + pipe_amount

        return total_cost

    def update_cost(self):
        self.plumbing_cost = self.calculate_cost()

