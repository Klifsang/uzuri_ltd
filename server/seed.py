from random import choice as rc
from faker import Faker
from models.dbconfig import db
from models.category import Category
from models.client import Client
from models.service import Service
from models.drilling_service import Drilling_Service
from models.depth_height_cost import DepthHeightCost
from models.pump import Pump
from models.pipe import Pipe
from app import app
from models.fee import Fee
from models.invoice import Invoice

fake = Faker()

if __name__ == '__main__':
    with app.app_context():
        print("Clearing db...")
        Category.query.delete()
        Client.query.delete()
        Service.query.delete()
        Drilling_Service.query.delete()
        Pump.query.delete()
        DepthHeightCost.query.delete()
        Pump.query.delete()
        Pipe.query.delete()
        Fee.query.delete()
        Invoice.query.delete()

        print("Seeding categories...")
        categories = [
            Category(category_name='Industrial', cat_surveyfee='20000', cat_localfee='50000'),
            Category(category_name='Commercial', cat_surveyfee='15000', cat_localfee='30000'),
            Category(category_name='Domestic', cat_surveyfee='7000', cat_localfee='10000')
        ]
        db.session.add_all(categories)
        db.session.commit()

        print("Seeding pipes...")
        pipes = [
            Pipe(pipe_name='PVC - Polyvinyl Chloride', pipe_cost='1200'),
            Pipe(pipe_name='PEX - Cross-linked Polyethylene', pipe_cost='1200'),
            Pipe(pipe_name='ABS - Acrylonitrile Butadiene Styrene', pipe_cost='2000'),
            Pipe(pipe_name='Copper', pipe_cost='2100'),
            Pipe(pipe_name='Cast Iron', pipe_cost='2500'),
            Pipe(pipe_name='Galvanized Stell', pipe_cost='2500')
            
        ]
        db.session.add_all(pipes)
        db.session.commit()

        print("Seeding Depth Height Cost...")
        depth_height_costs = [
            DepthHeightCost(min_depth_height='1', max_depth_height='100', cost_per_meter='1000'),
            DepthHeightCost(min_depth_height='101', max_depth_height='200', cost_per_meter='1500'),
            DepthHeightCost(min_depth_height='201', max_depth_height='300', cost_per_meter='2000'),
            DepthHeightCost(min_depth_height='300', max_depth_height='999', cost_per_meter='2500'),
        ]
        db.session.add_all(depth_height_costs)
        db.session.commit()

        print("Seeding services...")
        services = [
            Service(service_name='Drilling services'),
            Service(service_name='Plumbing Services'),
            Service(service_name='Pump Services'),
            Service(service_name='Tank Services'),
            Service(service_name='Pump Maintenance')

        ]
        db.session.add_all(services)
        db.session.commit()

        print("Seeding Pumps...")
        pumps = [
            Pump(pump_name='submersible electric pump', cost = '90000'),
            Pump(pump_name='Solar pump', cost = '65000'),
            Pump(pump_name='hand pump', cost = '30000'),
            Pump(pump_name='pump maintenance', cost = '10000'),
        ]
        db.session.add_all(pumps)
        db.session.commit()

        print("Seeding Drilling Services...")
        drilling_services = [
            Drilling_Service(drill_type='Symmetric drilling', downpayment= '130000',service_id='1'),
            Drilling_Service(drill_type='Core drilling', downpayment= '225000',service_id='1'),
            Drilling_Service(drill_type='Geo technical drilling', downpayment= '335000',service_id='1')

        ]
        db.session.add_all(drilling_services)
        db.session.commit()


        print("Seeding Clients...")
        clients = []
        all_emails = set()  # Use a set to efficiently check for uniqueness
        for _ in range(10):  # Adjust the range according to the number of clients you want to seed
            email = fake.email()
            while email in all_emails:
                email = fake.email()
            all_emails.add(email)
            category = rc(categories)  # Get a random category object
            client = Client(
                firstName=fake.first_name(),
                lastName=fake.last_name(),
                email=email,
                address=fake.address(),
                phone_number=fake.phone_number(),
                location=fake.city(),
                category_id=category.id,  # Assign the ID of the category
            )
            clients.append(client)

        db.session.add_all(clients)
        db.session.commit()

        print("Done Seeding!")
