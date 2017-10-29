# server/views/post.py

from flask import Blueprint, jsonify, request, make_response
from flask.views import MethodView
from server.models import Post
from server import app

post_bp = Blueprint('post', __name__, url_prefix="/post")


def json_response(res, status):
    return make_response(jsonify(res)), status


class PostsAPI(MethodView):
    """ Posts Resource """

    def get(self):
        try:
            distance = int(request.args.get("distance", "3"))
            location = request.args.get("location", "")
            #if location == "":
            #   raise Exception("invalid location")
            req = dict(location=location, distance=distance)
            if not isinstance(distance, int):
                raise Exception("invalid arguments")
        except Exception:
            res = {"status": "failure", "message": "invalid arguments"}
            return json_response(res, 400)

        posts = Post.get_post_list(**req)

        if posts is None:
            res = {"status": "failure", "message": "Error occurred"}
            return json_response(res, 402)

        res = []
        for p in posts:
            res.append({
                "vendor_id": p.vendor_id,
                "location": p.location,
                "time": p.time
            })
        return json_response(res, 200)


posts_view = PostsAPI.as_view("posts_api")
post_bp.add_url_rule("/", view_func=posts_view, methods=["GET"])