from .dbconfig import db
from sqlalchemy_serializer import SerializerMixin


class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'
    
     # Add Serialization
    serialize_rules = ('-clients.category',)


    id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String, nullable=False)
    cat_surveyfee = db.Column(db.Integer, nullable=False)
    cat_localfee = db.Column(db.Integer, nullable=False)

    #Relationship
    clients = db.relationship('Client', back_populates='category')


    def __repr__(self):
        return f"<Category {self.category_id}, {self.category_name} {self.cat_surveyfee} {self.cat_localfee}>"


