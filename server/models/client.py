from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from sqlalchemy import UniqueConstraint
from .client_service import Client_Service
from .dbconfig import db

class Client(db.Model, SerializerMixin):
    __tablename__ = 'clients'

    # Add Serialization
    # serialize_rules = ('-users',)

    client_id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String, nullable=False)
    lastName = db.Column(db.String,nullable=False)
    email = db.Column(db.String,nullable=False)
    address = db.Column(db.String,nullable=False)
    phone_number = db.Column(db.String,nullable=False)
    location = db.Column(db.String,nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    
    

    category = db.relationship('Category', back_populates='clients')
    fees = db.relationship('Fee', back_populates='client')

     # Relationship mapping client to related user
    # user = db.relationship('User', back_populates='clients', cascade='all, delete-orphan')

    #Relationship mapping the client to related clientservice
    # clientservices = db.relationship('Client_Service', back_populates='client', cascade='all, delete-orphan')
    # clientservices = db.relationship('Client_Service', back_populates='client')
    #Association proxy to get services for the client through the clientservices
    services = association_proxy('clientservices', 'service', creator=lambda service_obj: Client_Service(service_obj))

    #Relationship between client and transasctions
    # transactions = db.relationship('Transaction', back_populates='client')


    @validates('email')
    def validate_email(self,key,email):
        if '@' not in email:
            raise ValueError('Invalid email format')
        return email
    
    __table_args__ = (
        UniqueConstraint('email', name='uq_email'),  # Define UniqueConstraint here
    )
    
    # @validates('phone_number')
    # def validate_phone_number(self, key, phone_number):
    #     if phone_number and not all(c.isdigit() or c in '- ()+' for c in phone_number):
    #         raise ValueError("Phone number must contain only digits and standard separators (dashes, spaces, plus).")
    #     if len(phone_number) < 10 or len(phone_number) > 15:
    #         raise ValueError("Phone number must be between 10 and 15 characters")
    #     return phone_number


    def __repr__(self):
        return f"<Client {self.client_id}, {self.firstName}, {self.lastName} , {self.email}, {self.location}>"


    