import sys
import json
import unittest

from server import db
from server.models import Vendor, Post
from tests.base import BaseTestCase

class TestPostBlueprint(BaseTestCase):
    def test_get_post_list(self):
        vendor = Vendor.add_vendor(dict(email="test1@gmail.com",
                                        password="test1"))
        post=dict(location="in the middle of no where",
                  time="at the start of time",
                  menu="nothing really")
        post = Post.add_post(vendor.id, post)

        with self.client:
            response = self.client.get("/post/")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.json), 1)

    def test_add_post(self):
       vendor = Vendor.add_vendor(dict(email="test1@gmail.com",
                                        password="test1"))
       token = vendor.encode_auth_token()
       post=dict(location="in the middle of no where",
                 time="at the start of time",
                 menu="nothing really")
       with self.client:
           response = self.client.post("/post/",
                                       data=post,
                                       headers=dict(Authorization=token))
           self.assertEqual(response.status_code, 201)



if __name__ == "__main__":
    unittest.main()

