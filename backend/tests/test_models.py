
import unittest

from server import db
from server.models import Vendor, Post
from tests.base import BaseTestCase


class TestVendorModel(BaseTestCase):

  def test_add_vendor(self):
    form=dict(email="test@gmail.com",
              password="pwd")
    v = Vendor.add_vendor(form)
    self.assertIsNotNone(v)
    self.assertEqual(v.email, form.get("email"))


  def test_get_vendor(self):
    v1 = Vendor.add_vendor(dict(email="test1@gmail.com",
                                password="pwd"))
    v2 = Vendor.add_vendor(dict(email="test2@gmail.com",
                                password="pwd"))

    v = Vendor.get_vendor(v2.id)
    self.assertEqual(v, v2)

    v = Vendor.get_vendor_by_email(v1.email)
    self.assertEqual(v, v1)

  def test_get_vendor_list(self):
    v1 = Vendor.add_vendor(dict(email="test1@gmail.com",
                                password="pwd"))
    v2 = Vendor.add_vendor(dict(email="test2@gmail.com",
                                password="pwd"))

    vs = Vendor.get_vendor_list()
    self.assertEqual(len(vs), 2)
    self.assertEqual(vs[0], v1)
    self.assertEqual(vs[1], v2)



class TestPostModel(BaseTestCase):

  def test_add_post(self):
    vendor = Vendor.add_vendor(dict(email="test@gmail.com",
                                    password="pwd"))

    form = dict(vendor_id=vendor.id,
                location="Columbia University, New York",
                time="Mon-Fri 10am-5pm",
                lat=40.8075355,
                lng=-73.9625727)
    post = Post.add_post(vendor.id, form)
    self.assertIsNotNone(post)
    self.assertEqual(post.vendor_id, form.get("vendor_id"))


  def test_get_latest_post(self):
    vendor = Vendor.add_vendor(dict(email="test@gmail.com",
                          password="pwd"))

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
    vendor = Vendor.add_vendor(dict(email="test@gmail.com",
                          password="pwd"))

    p1 = Post.add_post(vendor.id,
                       dict(vendor_id=vendor.id,
                            location="Columbia University, New York",
                            time="Mon-Fri 10am-5pm",
                            lat=40.8075355,
                            lng=-73.9625727))
    self.assertIsNotNone(p1)

    p2 = Post.add_post(vendor.id,
                       dict(vendor_id=vendor.id,
                            location="Time Square, New York",
                            time="Schedule",
                            lat=40.7589,
                            lng=-73.9851))
    self.assertIsNotNone(p2)

    posts = Post.get_post_list(p1.lat, p1.lng, 1)
    self.assertEqual(len(posts), 1)

    posts = Post.get_post_list(p1.lat, p1.lng, 5)
    self.assertEqual(len(posts), 2)




if __name__ == "__main__":
    unittest.main()
