import sys
import json
import unittest

from server import db
from server.models.vendor import Vendor
from tests.base import BaseTestCase

class TestVendorBlueprint(BaseTestCase):
    def test_get_vendors(self):
    	Vendor.add_vendor(dict(email="test1@gmail.com", password="test1"))
        Vendor.add_vendor(dict(email="test2@gmail.com", password="test2"))
    	with self.client:
            response = self.client.get("/vendor/")
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(data), 2)

    def test_registration(self):
        with self.client:
            response = self.register_vendor('test@gmail.com', 'pwd')
            self.assertEqual(response.status_code, 201)

    def test_repeated_registration(self):
    	v = Vendor.add_vendor(dict(email="test1@gmail.com", password="test1"))
        with self.client:
            response = self.register_vendor(v.email, "pwd")
            self.assertEqual(response.status_code, 202)



    def register_vendor(self, email, password):
        return self.client.post(
            "/vendor/",
            data=dict(email=email,
                      password=password))


if __name__ == "__main__":
    unittest.main()

