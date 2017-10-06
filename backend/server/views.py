# server/views.py

from flask import Blueprint, jsonify, request, make_response
from flask.views import MethodView
from server.models import Vendor

vendor_bp = Blueprint('vendor', __name__, url_prefix="/vendor")


def json_response(res, status):
    return make_response(jsonify(res)), status


class VendorsAPI(MethodView):
    """ Vendors Resource """

    def get(self):
        vendors = Vendor.get_vendor_list()
        if not vendors:
            res = {"status": "failure", "message": "Error occurred"}
            return json_response(res, 402)

        res = []
        for v in vendors:
            res.append({
                "vendor_id": v.id,
                "email": v.email,
                "registered_on": v.registered_on
            })
        return json_response(res, 200)

    def post(self):
        post_data = request.json
        if Vendor.vendor_exists(post_data.get('email')):
            res = {"status": "failure", "message": "User already exists."}
            return json_response(res, 202)

        vendor = Vendor.add_vendor(post_data)
        if vendor:
            res = {"status": "success", "id": vendor.id}
            return json_response(res, 201)

        res = {"status": "failure", "message": "Error occurred"}
        return json_response(res, 401)


class VendorAPI(MethodView):
    """ Vendor Resource"""

    def get(self, vendor_id):
        vendor = Vendor.get_vendor(vendor_id)
        if not vendor:
            res = {"status": "failure", "message": "Error occurred"}
            return json_response(res, 401)

        res = {
            "vendor_id": vendor.id,
            "email": vendor.email,
            "registered_on": vendor.registered_on
        }
        return json_response(res, 200)


vendors_view = VendorsAPI.as_view("vendors_api")
vendor_view = VendorAPI.as_view("vendor_api")

vendor_bp.add_url_rule("/", view_func=vendors_view, methods=["GET", "POST"])

vendor_bp.add_url_rule(
    "/<int:vendor_id>", view_func=vendor_view, methods=["GET"])
