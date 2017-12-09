import unittest
from server import db, app
from server.models import BlacklistToken
from server.middleware import AuthPolicy
from tests.base import BaseTestCase
import jwt
import datetime

class TestAuthPolicy(BaseTestCase):
    def create_token(self, payload):
        return jwt.encode(payload, app.config.get("SECRET_KEY"))

    def test_decode_token(self):
        payload = {
            'exp': datetime.datetime.utcnow() + \
            datetime.timedelta(days=0, minutes=30),
            'iat': datetime.datetime.utcnow(),
            'sub': 1
        }
        token = self.create_token(payload)
        resp = AuthPolicy.decode_auth_token(token)
        self.assertTrue(not isinstance(resp, str))
        self.assertTrue(resp == 1)


    def test_decode_token_failed(self):
        payload = {
            'iat': datetime.datetime.utcnow(),
        }
        token = self.create_token(payload)
        resp = AuthPolicy.decode_auth_token(token)
        self.assertTrue(isinstance(resp, str))

    def test_decode_token_expired(self):
        payload = {
            'exp': datetime.datetime.utcnow() - \
            datetime.timedelta(days=0, minutes=30),
            'iat': datetime.datetime.utcnow()
        }
        token = self.create_token(payload)
        resp = AuthPolicy.decode_auth_token(token)
        self.assertTrue(isinstance(resp, str))


    def test_decode_token_blacklisted(self):
        payload = {
            'exp': datetime.datetime.utcnow() + \
            datetime.timedelta(days=0, minutes=30),
            'iat': datetime.datetime.utcnow(),
            'sub': 1
        }
        token = self.create_token(payload)
        blacklist_token = BlacklistToken(token=token)
        db.session.add(blacklist_token)
        db.session.commit()
        self.assertTrue(isinstance(AuthPolicy.decode_auth_token(token), str))


if __name__ == "__main__":
    unittest.main(verbosity=2)
