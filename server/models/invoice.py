from server.models.dbconfig import db
from datetime import date

class Invoice(db.Model):
    __tablename__ = 'invoices'

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, nullable=False)
    client_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    client_category = db.Column(db.String(255), nullable=False)
    invoice_number = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False, default=date.today)
    project_status = db.Column(db.String(255), nullable=False)
    drilling_name = db.Column(db.String(255), nullable=False)
    pump_name = db.Column(db.String(255), nullable=False)
    pipe_name = db.Column(db.String(255), nullable=False)
    pipe_diameter = db.Column(db.Integer, nullable=False, default=0)
    pipe_length = db.Column(db.Integer, nullable=False, default=0)
    number_of_outlets = db.Column(db.Integer, nullable=False, default=0)
    tank_capacity = db.Column(db.Integer, nullable=False, default=0)
    total_cost_before_tax = db.Column(db.Integer, nullable=False, default=0)
    tax_amount = db.Column(db.Integer, nullable=False, default=0)
    total_cost_after_tax = db.Column(db.Integer, nullable=False, default=0)
    # fee_id = db.Column(db.Integer, db.ForeignKey('fees.id'), nullable=False)

    # Relationship to Fee
    # fee = db.relationship('Fee', back_populates='invoice', uselist=False)

    def __repr__(self):
        return f'<Invoice {self.id}, {self.invoice_number}>'

    def to_dict(self):
        return {
            'id': self.id,
            'client_id': self.client_id,
            'client_name': self.client_name,
            'email': self.email,
            'client_category': self.client_category,
            'invoice_number': self.invoice_number,
            'date': self.date.isoformat(),
            'project_status': self.project_status,
            'drilling_name': self.drilling_name,
            'pump_name': self.pump_name,
            'pipe_name': self.pipe_name,
            'pipe_diameter': self.pipe_diameter,
            'pipe_length': self.pipe_length,
            'number_of_outlets': self.number_of_outlets,
            'tank_capacity': self.tank_capacity,
            'total_cost_before_tax': self.total_cost_before_tax,
            'tax_amount': self.tax_amount,
            'total_cost_after_tax': self.total_cost_after_tax
            # 'fee_id': self.fee_id
        }
