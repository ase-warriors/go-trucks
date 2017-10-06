import sys
import json
import unittest

from server import db
from server.models import Vendor
from tests.base import BaseTestCase

class TestVendorBlueprint(BaseTestCase):
    def test_get_vendors(self):
	vendor1 = Vendor(
	    email="test1@gmail.com",
	    password="test1"
	)
	vendor2 = Vendor(
	    email="test2@gmail.com",
	    password="test2"
	)
	db.session.add(vendor1)
	db.session.add(vendor2)
	db.session.commit()
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
	vendor = Vendor(
	    email="test1@gmail.com",
	    password="test1"
	)
	db.session.add(vendor)
	db.session.commit()

        with self.client:
            response = self.register_vendor(vendor.email, "pwd")
            self.assertEqual(response.status_code, 202) 


   
    def register_vendor(self, email, password):
        return self.client.post(
	    "/vendor/",
	    data=json.dumps(dict(
	        email=email,
	        password=password
	    )),
      	    content_type='application/json',
        )


if __name__ == "__main__":
    unittest.main()
 
