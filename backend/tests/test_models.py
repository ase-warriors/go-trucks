
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



class TestPostModel(BaseTestCase):

  def test_add_post(self):
    vendor = Vendor(
       email="test@gmail.com",
       password="pwd"
    )
    db.session.add(vendor)
    db.session.commit()

    form = dict(vendor_id=vendor.id,
                location="Columbia University, New York",
                time="forever")
    post = Post.add_post(vendor.id, form)
    self.assertEqual(post.vendor_id, form.get("vendor_id"))
    self.assertEqual(post.location, form.get("location"))
    self.assertEqual(post.time, form.get("time"))


  def get_latest_post(self):
    v = Vendor.add_vendor(dict(email="test@gmail.com",
                          password="pwd"))

    form = dict(vendor_id=vendor.id,
                location="Columbia University, New York",
                time="t1")
    p1 = Post.add_post(vendor.id, form)

    form.time="t2"
    p2 = Post.add_post(vendor.id, form)

    post = Post.get_latest_post(vendor.id)
    self.assertEqual(post, p2)



if __name__ == "__main__":
    unittest.main()
