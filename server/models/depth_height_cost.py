from server.models.dbconfig import db
from sqlalchemy_serializer import SerializerMixin

class DepthHeightCost(db.Model, SerializerMixin):
    __tablename__ = 'depth_height_costs'

    id = db.Column(db.Integer, primary_key=True)
    min_depth_height = db.Column(db.Integer, nullable=False)
    max_depth_height = db.Column(db.Integer, nullable=False)
    cost_per_meter = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<DepthHeightCost {self.min_depth_height}-{self.max_depth_height}: {self.cost_per_meter}>'
