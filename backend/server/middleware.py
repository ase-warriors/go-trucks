from server.models import BlacklistToken
from server import app, db
import jwt


class AuthPolicy(object):
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        unkown_policy = {"role": "unknown"}
        auth_header = environ.get("HTTP_AUTHORIZATION", "")
        app.logger.debug("header=%s", auth_header)
        if auth_header:
            try:
                auth_token = auth_header.split(" ")[0]
                if auth_token:
                    resp = AuthPolicy.decode_auth_token(auth_token)
                    if not isinstance(resp, str):
                        policy = {"role": "vendor", "vendor_id": resp}
                        app.logger.debug("policy=%s", policy)
                        environ["policy"] = policy
                        return self.app(environ, start_response)
            except IndexError:
                pass
        environ["policy"] = unkown_policy
        return self.app(environ, start_response)

    @staticmethod
    def decode_auth_token(auth_token):
        # return: integer or string
        # TODO(amy): change to error not string
        try:
            payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'))
            is_blacklisted = BlacklistToken.check_blacklist(auth_token)
            if is_blacklisted:
                return 'Token blacklisted. Please log in again.'
            else:
                return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'
