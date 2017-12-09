
import unittest

from server.models import Vendor
from tests.base import BaseTestCase


class TestVendorModel(BaseTestCase):

  def test_add_vendor(self):
    form=dict(email="test@gmail.com",
              password="pwd",
              name="Vendor1")
    v = Vendor.add_vendor(form)
    self.assertIsNotNone(v)
    self.assertEqual(v.email, form.get("email"))
    self.assertEqual(v.name, form.get("name"))


  def test_get_vendor(self):
    v1 = Vendor.add_vendor(dict(email="test1@gmail.com",
                                password="pwd",
                                name="Vendor1"))
    v2 = Vendor.add_vendor(dict(email="test2@gmail.com",
                                password="pwd",
                                name="Vendor1"))

    v = Vendor.get_vendor(v2.id)
    self.assertEqual(v, v2)

    v = Vendor.get_vendor_by_email(v1.email)
    self.assertEqual(v, v1)

  def test_get_vendor_list(self):
    v1 = Vendor.add_vendor(dict(email="test1@gmail.com",
                                password="pwd",
                                name="Vendor1"))
    v2 = Vendor.add_vendor(dict(email="test2@gmail.com",
                                password="pwd",
                                name="Vendor2"))

    vs = Vendor.get_vendor_list()
    self.assertEqual(len(vs), 2)
    self.assertEqual(vs[0], v1)
    self.assertEqual(vs[1], v2)



if __name__ == "__main__":
    unittest.main()
