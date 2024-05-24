from .dbconfig import db
from sqlalchemy_serializer import SerializerMixin

class Pump(db.Model, SerializerMixin):
    __tablename__ = 'pumps'

    serialize_rules = ('-pumpservice.pumps',)

    id = db.Column(db.Integer, primary_key=True)
    pump_name = db.Column(db.String, nullable=False)
    cost = db.Column(db.Integer, nullable=False)
    pumpservice = db.relationship('Pump_Service', back_populates='pumps')
    fees = db.relationship('Fee', back_populates='pump')

    def __repr__(self):
        return f'<Pump {self.id}, {self.pump_name}, {self.cost}>'
