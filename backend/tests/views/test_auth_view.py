import unittest
from server import db
from server.models import Vendor, BlacklistToken
from tests.base import BaseTestCase
from mock import patch

class TestAuthBlueprint(BaseTestCase):
    def test_successful_login(self):
        v = Vendor.add_vendor(dict(email="test1@gmail.com",
                                   password="test1", name="vendor1"))
        with self.client:
            response = self.login_vendor(v.email, "test1")
            self.assertEqual(response.status_code, 200)
            self.assertTrue('auth_token' in response.json)

    def test_failed_login(self):
        v = Vendor.add_vendor(dict(email="test1@gmail.com",
                                   password="test1", name="vendor1"))
        with self.client:
            response = self.login_vendor(v.email, "wrongpassword")
            self.assertEqual(response.status_code, 404)
            self.assertFalse('auth_token' in response.json)

    @patch("server.models.Vendor.encode_auth_token")
    def test_failed_login2(self, mock_encode_auth_token):
        mock_encode_auth_token.return_value = None
        v = Vendor.add_vendor(dict(email="test1@gmail.com",
                                   password="test1", name="vendor1"))
        with self.client:
            response = self.login_vendor(v.email, "test1")
            self.assertEqual(response.status_code, 500)

    def test_failed_login3(self):
        with self.client:
            response = self.client.post(
                "/auth/login", data=dict(email="testemail"))
            self.assertEqual(response.status_code, 404)

            v = Vendor.add_vendor(dict(email="test1@gmail.com",
                                       password="test1", name="vendor1"))

            response = self.client.post(
                "/auth/login", data=dict(email=v.email))
            self.assertEqual(response.status_code, 500)




    def test_successful_logout(self):
        v = Vendor.add_vendor(dict(email="test1@gmail.com",
                                   password="test1", name="vendor1"))
        token = v.encode_auth_token()
        with self.client:
            response = self.logout_vendor(token)
            self.assertEqual(response.status_code, 200)
            self.assertTrue(BlacklistToken.check_blacklist(token))

    def test_failed_logout(self):
        token = "wrongtoken"
        with self.client:
            response = self.logout_vendor(token)
            self.assertEqual(response.status_code, 401)
            self.assertFalse(BlacklistToken.check_blacklist(token))

        with self.client:
            response = self.logout_vendor("")
            self.assertEqual(response.status_code, 403)


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
