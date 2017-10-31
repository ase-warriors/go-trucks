# server/vendor.py

from flask import Blueprint, jsonify, request, make_response
from flask.views import MethodView
from server.models import Vendor, Post
from server import app

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
        post_data = request.form
        if Vendor.get_vendor_by_email(post_data.get('email')) != None:
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
            return json_response(res, 404)

        res = {
            "vendor_id": vendor.id,
            "email": vendor.email,
            "registered_on": vendor.registered_on
        }
        return json_response(res, 200)


class VendorPostAPI(MethodView):
    def get(self, vendor_id):
        try:
            number = int(request.args.get("num", "1"))
            if number < 0:
                raise ValueError
        except ValueError:
            return json_response({
                "status": "failure",
                "message": "Invalid argument"
            }, 400)

        policy = request.environ.get("policy")
        if policy is None or policy["role"] != "vendor" or policy["vendor_id"] != vendor_id:
            # other vendor/customer can only view the latest post
            number = 1

        posts = Post.get_latest_post(vendor_id, number)
        if posts is None:
            res = {"status": "failure", "message": "Error occurred"}
            return json_response(res, 404)

        res = []
        for p in posts:
            res.append({
                "location": p.location,
                "time": p.time,
                "lat": p.lat,
                "lng": p.lng,
            })
            if p.menu:
                res[-1]["menu"] = p.menu
        return json_response(res, 200)

    def post(self, vendor_id):
        policy = request.environ.get("policy")
        if policy is None or policy["role"] != "vendor" or policy["vendor_id"] != vendor_id:
            res = {"status": "failure", "message": "User not authorized."}
            return json_response(res, 401)

        post_data = request.form
        post = Post.add_post(vendor_id, post_data)
        if post:
            res = {"status": "success", "message": "New post is added."}
            return json_response(res, 201)

        res = {"status": "failure", "message": "Error occurred"}
        return json_response(res, 401)


vendor_bp.add_url_rule(
    "", view_func=VendorsAPI.as_view("vendors_api"), methods=["GET", "POST"])
vendor_bp.add_url_rule(
    "/<int:vendor_id>",
    view_func=VendorsAPI.as_view("vendor_api"),
    methods=["GET"])
vendor_bp.add_url_rule(
    "/<int:vendor_id>/post",
    view_func=VendorPostAPI.as_view("vendor_post_api"),
    methods=["GET", "POST"])
