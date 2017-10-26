
import unittest

from server import db
from server.models import Vendor, Post
from tests.base import BaseTestCase


class TestVendorModel(BaseTestCase):

  def test_add_vendor(self):
    vendor = Vendor(
       email="test@gmail.com",
       password="pwd"
    )
    db.session.add(vendor)
    db.session.commit()

class TestPostModel(BaseTestCase):

  def test_add_post(self):
    vendor = Vendor(
       email="test@gmail.com",
       password="pwd"
    )
    db.session.add(vendor)
    db.session.commit()

    form=dict(vendor_id=vendor.id,
              location="nowhere",
              time="forever")
    post=Post.add_post(vendor.id, form)

  def get_latest_post(self):
    vendor = Vendor(
       email="test@gmail.com",
       password="pwd"
    )
    db.session.add(vendor)
    db.session.commit()

    form=dict(vendor_id=vendor.id,
              location="nowhere",
              time="t1")
    Post.add_post(vendor.id, form)
    form.time="t2"
    Post.add_post(vendor.id, form)
    post = Post.get_latest_post(vendor.id)
    self.assertEqual(post.time, "t2")



if __name__ == "__main__":
    unittest.main()
