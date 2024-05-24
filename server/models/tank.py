from sqlalchemy_serializer import SerializerMixin
from server.models.dbconfig import db

class Tank(db.Model, SerializerMixin):
    __tablename__ = 'tanks'

    #serialization
    serialize_rules=('-service.tanks',)

    tank_id = db.Column(db.Integer, primary_key=True)
    tank_name = db.Column(db.Integer, nullable=False)
    # price_per_liter = db.Column(db.Integer, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    Tank_cost = db.Column(db.Integer, nullable=False)
    # tank_cost = db.Column(db.Integer, nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.service_id'))

    #One to many relationship between tank and service
    
    service = db.relationship('Service', back_populates='tanks')
    # fees = db.relationship('Fee', back_populates='tank')

    def __repr__(self):
        return f'<Tank {self.tank_id}, {self.capacity}>'
    
    def calculate_cost(self):
        price_per_liter = int(40)
        capacity = self.capacity
        total_cost = capacity * price_per_liter
        
        return total_cost

    def update_cost(self):
        self.Tank_cost = self.calculate_cost()
