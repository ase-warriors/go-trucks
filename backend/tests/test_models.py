
import unittest

from server import db
from server.models import Vendor
from tests.base import BaseTestCase


class TestVendorModel(BaseTestCase):

  def test_add_vendor(self):
    vendor = Vendor(
       email="test@gmail.com",
       password="pwd"
    )
    db.session.add(vendor)
    db.session.commit()

if __name__ == "__main__":
    unittest.main()
