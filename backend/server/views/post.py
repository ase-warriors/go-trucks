# server/views/post.py

from flask import Blueprint, jsonify, request, make_response
from flask.views import MethodView
from server.models import Post

post_bp = Blueprint('post', __name__, url_prefix="/post")


def json_response(res, status):
    return make_response(jsonify(res)), status


class PostsAPI(MethodView):
    """ Posts Resource """

    def get(self):
        try:
            # TODO(amy): unit is mile?
            if "distance" not in request.args:
                distance = None
            else:
                distance_in_miles = float(request.args.get("distance"))
                distance = distance_in_miles * 1.60934 * 1000
            lat = float(request.args.get("lat"))
            lng = float(request.args.get("lng"))
        except Exception as e:
            print e
            res = {"status": "failure", "message": "Invalid arguments"}
            return json_response(res, 400)

        posts = Post.get_post_list(lat, lng, distance)
        if posts is None:
            res = {"status": "failure", "message": "Error occurred"}
            return json_response(res, 402)

        res = []
        for p in posts:
            res.append({
                "vendor_id": p.vendor_id,
                "vendor_name": p.name,
                "location": p.location,
                "lat": p.lat,
                "lng": p.lng,
                "time": p.time
            })
            if p.menu is not None:
                res[-1]["menu"] = p.menu

        return json_response(res, 200)


posts_view = PostsAPI.as_view("posts_api")
post_bp.add_url_rule("/", view_func=posts_view, methods=["GET"])
