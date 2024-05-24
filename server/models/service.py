from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from server.models.client_service import Client_Service
from server.models.dbconfig import db

class Service(db.Model,SerializerMixin):
    __tablename__ = 'services'

    # Add Serialization
    serialize_rules = ('-clientservices.service','-tanks.service', '-plumbingservices.service', '-pumpservices.service', '-drillingservices.service',)

    service_id = db.Column(db.Integer, primary_key=True)
    service_name = db.Column(db.String, nullable=False)

    #Relationship mapping service to related clientservices
    # clientservices = db.relationship('Client_Service', back_populates='service', cascade='all, delete-orphan')
    # clientservices =  db.relationship('Client_Service', back_populates='service', lazy=True)
    #Association proxy to get clients of a service using clientservices
    clients = association_proxy('Client_Service', 'client', creator=lambda client_obj: Client_Service(client_obj))

    #Relationship mapping service to tank service, plumbing service, pump service and drilling service
    tanks = db.relationship('Tank', back_populates='service')
    plumbingservices = db.relationship('Plumbing_Service', back_populates='service', lazy=True)
    pumpservices = db.relationship('Pump_Service', back_populates='service')
    drillingservices = db.relationship('Drilling_Service', back_populates='service')
    # fees = db.relationship('Fee', back_populates='service')

    def __repr__(self):
        return f'<Service {self.service_id}, {self.service_name}>'