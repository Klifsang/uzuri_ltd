from flask import Blueprint, make_response, jsonify, request
from flask_restful import Api, Resource, abort

from models.dbconfig import db
from models.category import Category

admin_category_bp = Blueprint('admin_category', __name__)
api = Api(admin_category_bp)

class Categories(Resource):
    def get(self):
       categories = [category.to_dict(rules=('-clients',)) for category in Category.query.all()]
       return make_response(jsonify(categories), 200)
   
    def post(self):
       data = request.get_json()
       new_category = Category(
           category_name= data['category_name'],
           cat_surveyfee = data['cat_surveyfee'],
           cat_localfee = data['cat_localfee']
       )
       db.session.add(new_category)
       db.session.commit()
       response = make_response((new_category.to_dict(rules=('-clients',))), 201)
       return response

    def patch(self):
       pass

    def delete(self):
       pass
   


api.add_resource(Categories, '/api/admin/routes/categories/<int:category_id>',endpoint='category_by_id')
api.add_resource(Categories, '/api/admin/routes/categories', endpoint='categories')