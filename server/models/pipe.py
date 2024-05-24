from server.models.dbconfig import db
from sqlalchemy_serializer import SerializerMixin

class Pipe(db.Model, SerializerMixin):
    __tablename__ = 'pipes'

    serialize_rules = ('-plumbingservice.pipes',)

    id = db.Column(db.Integer, primary_key=True)
    pipe_name = db.Column(db.String, nullable=False)
    pipe_cost = db.Column(db.Integer, nullable=False)

    plumbingservice = db.relationship('Plumbing_Service', back_populates='pipes')
    fees = db.relationship('Fee', back_populates='pipe')
