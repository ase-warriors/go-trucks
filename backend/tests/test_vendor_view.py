import sys
import json
import unittest

from server import db
from server.models import Vendor, Post
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

    def test_add_post(self):
       vendor = Vendor.add_vendor(dict(email="test1@gmail.com",
                                        password="test1"))
       post=dict(location="in the middle of no where",
                 time="at the start of time",
                 menu="nothing really")
       with self.client:
           response = self.client.post("/vendor/" + str(vendor.id) + "/post",
                                       data=post,
                                       headers=dict(Authorization=vendor.encode_auth_token()))
           self.assertEqual(response.status_code, 201)

    def test_add_post_failed(self):
       vendor = Vendor.add_vendor(dict(email="test1@gmail.com",
                                        password="test1"))
       post=dict(location="in the middle of no where",
                 time="at the start of time",
                 menu="nothing really")
       with self.client:
           response = self.client.post("/vendor/" + str(vendor.id) + "/post",
                                       data=post,
                                       headers=dict(Authorization="wrongtoken"))
           self.assertEqual(response.status_code, 401)

           response = self.client.post("/vendor/" + str(vendor.id) + "/post",
                                       data=post)
           self.assertEqual(response.status_code, 401)


    def test_get_post(self):
       vendor = Vendor.add_vendor(dict(email="test1@gmail.com",
                                        password="test1"))
       form = dict(location="in the middle of no where",
                 time="at the start of time",
                 menu="nothing really")
       post = Post.add_post(vendor.id, form)
       self.assertIsNotNone(post)
       with self.client:
           response = self.client.get("/vendor/" + str(vendor.id) + "/post")
           self.assertEqual(response.status_code, 200)
           self.assertEqual(form["location"], response.json.get("location"))
           self.assertEqual(form["time"], response.json.get("time"))
           self.assertEqual(form["menu"], response.json.get("menu"))




    def register_vendor(self, email, password):
        return self.client.post(
            "/vendor/",
            data=dict(email=email,
                      password=password))


if __name__ == "__main__":
    unittest.main()

