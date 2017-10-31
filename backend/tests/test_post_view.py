import unittest
from server import db
from server.models import Vendor, Post
from tests.base import BaseTestCase

class TestPostBlueprint(BaseTestCase):
    def test_get_post_list(self):
        vendor = Vendor.add_vendor(dict(email="test@gmail.com",
                                        password="pwd"))
        form = dict(location="Columbia University, New York",
                    time="Mon-Fri 10am-5pm",
                    lat=40.8075355,
                    lng=-73.9625727)
        post = Post.add_post(vendor.id, form)
        self.assertIsNotNone(post)

        with self.client:
            response = self.client.get("/post/",
                                       query_string=dict(lat=40.8075355,
                                                         lng=-73.9625727,
                                                         distance=5.0))
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.json), 1)

            response = self.client.get("/post/",
                                       query_string=dict(lat=43.0,
                                                         lng=-73.0,
                                                         distance=5.0))
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.json), 0)



if __name__ == "__main__":
    unittest.main()

