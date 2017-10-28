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
        post=dict(location="Columbia University, New York",
                  time="at the start of time",
                  menu="nothing really")
        post = Post.add_post(vendor.id, post)

        with self.client:
            response = self.client.get("/post/",
                                       query_string=dict(location="Columbia University, New York",
                                                         distance=5))
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.json), 1)

            response = self.client.get("/post/",
                                       query_string=dict(location="Cornell University, New York",
                                                         distance=5))
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.json), 0)






if __name__ == "__main__":
    unittest.main()

