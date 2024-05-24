from server.models.dbconfig import db
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates


class User(db.Model,SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    # role = db.Column(db.String(100), nullable=False)

    # Relationship

    @validates('email')
    def validate_email(self,key,email):
        if '@' not in email:
            raise ValueError('Invalid email format')
        return email
    
    
