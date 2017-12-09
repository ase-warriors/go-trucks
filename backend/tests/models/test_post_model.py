
import unittest

from server.models import Post,Vendor
from tests.base import BaseTestCase


class TestPostModel(BaseTestCase):

  def add_example_vendor(self, name="test"):
    vendor = Vendor.add_vendor(dict(email=name+"@gmail.com",
                                    password="pwd",
                                    name=name))
    return vendor


  def test_add_post(self):
    vendor = self.add_example_vendor()
    form = dict(vendor_id=vendor.id,
                location="Columbia University, New York",
                time="Mon-Fri 10am-5pm",
                lat=40.8075355,
                lng=-73.9625727)
    post = Post.add_post(vendor.id, form)
    self.assertIsNotNone(post)
    self.assertEqual(post.vendor_id, form.get("vendor_id"))


  def test_add_post_failed(self):
    vendor = self.add_example_vendor()
    form = dict(vendor_id=vendor.id,
                location="Columbia University, New York",
                time="Mon-Fri 10am-5pm")
    post = Post.add_post(vendor.id, form)
    self.assertIsNone(post)


  def test_get_latest_post(self):
    vendor = self.add_example_vendor()
    form = dict(vendor_id=vendor.id,
                location="Columbia University, New York",
                time="Old Schedule",
                lat=40.8075355,
                lng=-73.9625727)
    p1 = Post.add_post(vendor.id, form)

    form["time"] = "New Schedule"
    p2 = Post.add_post(vendor.id, form)

    post = Post.get_latest_post(vendor.id, 1)
    self.assertEqual(len(post), 1)
    self.assertEqual(post[0], p2)


  def test_get_post_list(self):
    v1 = self.add_example_vendor("test1")
    v2 = self.add_example_vendor("test2")
    p1 = Post.add_post(v1.id,
                       dict(vendor_id=v1.id,
                            location="Columbia University, New York",
                            time="Mon-Fri 10am-5pm",
                            lat=40.8075355,
                            lng=-73.9625727))
    self.assertIsNotNone(p1)

    p2 = Post.add_post(v2.id,
                       dict(vendor_id=v2.id,
                            location="Time Square, New York",
                            time="Schedule",
                            lat=40.7589,
                            lng=-73.9851))
    self.assertIsNotNone(p2)

    posts = Post.get_post_list(p1.lat, p1.lng, 1)
    self.assertEqual(len(posts), 1)

    posts = Post.get_post_list(p1.lat, p1.lng, 8500)
    print posts
    self.assertEqual(len(posts), 2)


  def test_get_post_list_all(self):
    v1 = self.add_example_vendor("test1")
    v2 = self.add_example_vendor("test2")
    p1 = Post.add_post(v1.id,
                       dict(vendor_id=v1.id,
                            location="Columbia University, New York",
                            time="Mon-Fri 10am-5pm",
                            lat=40.8075355,
                            lng=-73.9625727))
    self.assertIsNotNone(p1)

    p2 = Post.add_post(v2.id,
                       dict(vendor_id=v2.id,
                            location="Time Square, New York",
                            time="Schedule",
                            lat=40.7589,
                            lng=-73.9851))
    self.assertIsNotNone(p2)

    posts = Post.get_post_list(p1.lat, p1.lng, None)
    self.assertEqual(len(posts), 2)


if __name__ == "__main__":
    unittest.main()
