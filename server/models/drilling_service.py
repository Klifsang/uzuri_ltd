from server.models.dbconfig import db
from sqlalchemy_serializer import SerializerMixin

class Drilling_Service(db.Model,SerializerMixin):
    __tablename__ = 'drillingservices'

    #serialization
    serialize_rules=('-service.drillingservices',)

    id = db.Column(db.Integer, primary_key=True)
    drill_type = db.Column(db.String, nullable=False)
    downpayment = db.Column(db.Integer, nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.service_id'))

    #One to many relationship between drilling services and service
    service = db.relationship('Service', back_populates='drillingservices')
    fees = db.relationship('Fee', back_populates='drillingservice')

    def __repr__(self):
        return f'<Drilling_Service {self.id}, {self.drill_type}>'