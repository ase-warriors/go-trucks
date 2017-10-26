import sys
import json
import unittest

from server import db
from server.models import Vendor
from tests.base import BaseTestCase

def create_test_vendor():
    email="test1@gmail.com"
    password = "test1"
    vendor = Vendor(email=email, password=password)
    db.session.add(vendor)
    db.session.commit()
    return vendor

class TestAuthBlueprint(BaseTestCase):
    def test_successful_login(self):
        v = create_test_vendor()
        with self.client:
            response = self.login_vendor(v.email, "test1")
            self.assertEqual(response.status_code, 200)
            self.assertTrue('auth_token' in response.json)

    def test_failed_login(self):
        v = create_test_vendor()
        with self.client:
            response = self.login_vendor(v.email, "wrongpassword")
            self.assertEqual(response.status_code, 404)
            self.assertFalse('auth_token' in response.json)

    def test_successful_logout(self):
        v = create_test_vendor()
        token = v.encode_auth_token()
        with self.client:
            response = self.logout_vendor(token)
            self.assertEqual(response.status_code, 200)

    def test_failed_logout(self):
        token = "wrongtoken"
        with self.client:
            response = self.logout_vendor(token)
            self.assertEqual(response.status_code, 401)



    def login_vendor(self, email, password):
        return self.client.post(
            "/auth/login",
            data=dict(email=email,
                      password=password))

    def logout_vendor(self, auth_token):
        return self.client.post(
            "/auth/logout",
            headers=dict(Authorization=auth_token))


if __name__ == "__main__":
    unittest.main(verbosity=2)

