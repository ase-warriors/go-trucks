# server/views/auth.py

from flask import Blueprint, request, make_response, jsonify
from flask.views import MethodView

from server import bcrypt, db
from server.models import Vendor, BlacklistToken
from server.middleware import AuthPolicy

auth_bp = Blueprint('auth', __name__)


class LoginAPI(MethodView):
    def post(self):
        post_data = request.form
        try:
            email = post_data.get('email')
            password = post_data.get('password')
            user = Vendor.get_vendor_by_email(email)
            if user and bcrypt.check_password_hash(user.password, password):
                auth_token = user.encode_auth_token()
                if auth_token:
                    res = {
                        'status': 'success',
                        'message': 'Successfully logged in.',
                        'auth_token': auth_token.decode(),
                        'vendor_id': user.id
                    }
                    return make_response(jsonify(res)), 200
            else:
                res = {'status': 'failure', 'message': 'User does not exist.'}
                return make_response(jsonify(res)), 404
        except Exception as e:
            print(e)
            res = {'status': 'failure', 'message': 'Try again'}
            return make_response(jsonify(res)), 500


class LogoutAPI(MethodView):
    def post(self):
        # get auth token
        auth_header = request.headers.get('Authorization')
        if auth_header:
            auth_token = auth_header.split(" ")[0]
        else:
            auth_token = ''
        if auth_token:
            resp = AuthPolicy.decode_auth_token(auth_token)
            if not isinstance(resp, str):
                # mark the token as blacklisted
                blacklist_token = BlacklistToken(token=auth_token)
                try:
                    # insert the token
                    db.session.add(blacklist_token)
                    db.session.commit()
                    res = {
                        'status': 'success',
                        'message': 'Successfully logged out.'
                    }
                    return make_response(jsonify(res)), 200
                except Exception as e:
                    res = {'status': 'failure', 'message': e}
                    return make_response(jsonify(res)), 200
            else:
                res = {'status': 'failure', 'message': resp}
                return make_response(jsonify(res)), 401
        else:
            res = {
                'status': 'failure',
                'message': 'Provide a valid auth token.'
            }
            return make_response(jsonify(res)), 403


login_view = LoginAPI.as_view('login_api')
logout_view = LogoutAPI.as_view('logout_api')

auth_bp.add_url_rule('/auth/login', view_func=login_view, methods=['POST'])
auth_bp.add_url_rule('/auth/logout', view_func=logout_view, methods=['POST'])
# auth_bp.add_url_rule('/auth/status', view_func=user_view, methods=['GET'])
