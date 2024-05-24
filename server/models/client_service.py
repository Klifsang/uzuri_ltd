from .dbconfig import db
from sqlalchemy_serializer import SerializerMixin

class Client_Service(db.Model, SerializerMixin):
    __tablename__ = "clientservices"

    #Add serializer
    serialize_rules=('-client.clientservices', '-service.clientservices',)

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('clients.client_id'), primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('services.service_id'), primary_key=True)

    # #Relationship mapping client_service to related client
    # client = db.relationship('Client', back_populates='clientservices')
    # #Relationship mapping client_service to related service
    # service = db.relationship('Service', back_populates='clientservices')

    def __repr__(self):
        return f'<Client_Service {self.id}>'
