# server/views/post.py

from flask import Blueprint, jsonify, request, make_response
from flask.views import MethodView
from server.models import Post
from server.utils import auth_policy

post_bp = Blueprint('post', __name__, url_prefix="/post")


def json_response(res, status):
    return make_response(jsonify(res)), status


class PostsAPI(MethodView):
    """ Posts Resource """

    def get(self):
        posts = Post.get_post_list()
        if not posts:
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

    def post(self):
        # TODO(amy): move auth_policy logic outside
        policy = auth_policy(request)
        if policy["role"] != "vendor":
            res = {"status": "failure", "message": "User not authorized."}
            return json_response(res, 401)

        post_data = request.form
        post = Post.add_post(policy.get("vendor_id"), post_data)
        if post:
            res = {"status": "success", "message": "New post is added."}
            return json_response(res, 201)

        res = {"status": "failure", "message": "Error occurred"}
        return json_response(res, 401)


posts_view = PostsAPI.as_view("posts_api")
post_bp.add_url_rule("/", view_func=posts_view, methods=["GET", "POST"])
