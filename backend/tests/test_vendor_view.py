import sys
import json
import unittest

from server import db
from server.models import Vendor, Post
from tests.base import BaseTestCase

class TestVendorBlueprint(BaseTestCase):

    def get_test_post_form(self):
        return dict(location="Columbia University, New York",
                    time="10am - 5pm",
                    menu="pizza $3")

    def test_get_vendors(self):
    	Vendor.add_vendor(dict(email="test1@gmail.com", password="test1"))
        Vendor.add_vendor(dict(email="test2@gmail.com", password="test2"))
    	with self.client:
            response = self.client.get("/vendor")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.json), 2)

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
       with self.client:
           response = self.client.post("/vendor/" + str(vendor.id) + "/post",
                                       data=self.get_test_post_form(),
                                       headers=dict(Authorization=vendor.encode_auth_token()))
           self.assertEqual(response.status_code, 201)

    def test_add_post_failed(self):
       vendor = Vendor.add_vendor(dict(email="test1@gmail.com",
                                        password="test1"))
       form = self.get_test_post_form()
       with self.client:
           response = self.client.post("/vendor/" + str(vendor.id) + "/post",
                                       data=form,
                                       headers=dict(Authorization="wrongtoken"))
           self.assertEqual(response.status_code, 401)

           response = self.client.post("/vendor/" + str(vendor.id) + "/post",
                                       data=form)
           self.assertEqual(response.status_code, 401)


    def test_get_post(self):
       vendor = Vendor.add_vendor(dict(email="test1@gmail.com",
                                        password="test1"))
       form = self.get_test_post_form()
       post = Post.add_post(vendor.id, form)
       self.assertIsNotNone(post)
       with self.client:
           response = self.client.get("/vendor/" + str(vendor.id) + "/post",
                                      query_string=dict(num=1))
           self.assertEqual(response.status_code, 200)
           self.assertEqual(len(response.json), 1)
           self.assertEqual(response.json[0], form)
           print "Get post:", response.json


    def test_get_post_empty(self):
       vendor = Vendor.add_vendor(dict(email="test1@gmail.com",
                                        password="test1"))
       form = self.get_test_post_form()
       with self.client:
           response = self.client.get("/vendor/" + str(vendor.id) + "/post",
                                      query_string=dict(num=1))
           self.assertEqual(response.json, list())
           self.assertEqual(response.status_code, 200)

           response = self.client.get("/vendor/" + str(vendor.id) + "/post",
                                      query_string=dict(num="xxx"))
           self.assertEqual(response.status_code, 400)

           response = self.client.get("/vendor/" + str(vendor.id) + "/post",
                                      query_string=dict(num=-1))
           self.assertEqual(response.status_code, 400)


    def register_vendor(self, email, password):
        return self.client.post(
            "/vendor",
            data=dict(email=email,
                      password=password))


if __name__ == "__main__":
    unittest.main()

