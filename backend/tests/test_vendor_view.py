import unittest
from server.models import Vendor, Post
from tests.base import BaseTestCase

def get_test_post_form():
    return dict(location="Columbia University, New York",
                lat=40.8075355,
                lng=-73.9625727,
                time="10am - 5pm",
                menu="pizza $3")

class TestVendorBlueprint(BaseTestCase):

    def test_get_vendors(self):
        Vendor.add_vendor(dict(email="test1@gmail.com",
                               password="test1", name="vendor1"))
        Vendor.add_vendor(dict(email="test2@gmail.com",
                               password="test2", name="vendor2"))
        with self.client:
            response = self.client.get("/vendor")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.json), 2)

    def test_registration(self):
        with self.client:
            response = self.register_vendor('test@gmail.com', 'pwd', 'vendor')
            self.assertEqual(response.status_code, 201)

    def test_repeated_registration(self):
        v = Vendor.add_vendor(dict(email="test1@gmail.com",
                                   password="test1",
                                   name="vendor1"))
        with self.client:
            response = self.register_vendor(v.email, "pwd", 'vendor')
            self.assertEqual(response.status_code, 202)


    def test_add_post(self):
        vendor = Vendor.add_vendor(dict(email="test1@gmail.com",
                                        password="test1",
                                        name="vendor1"))
        with self.client:
            response = self.add_vendor_post(vendor.id, get_test_post_form(),
                                            vendor.encode_auth_token())
            self.assertEqual(response.status_code, 201)

    def test_add_post_failed(self):
        vendor = Vendor.add_vendor(dict(email="test1@gmail.com",
                                        password="test1", name="vendor1"))
        form = get_test_post_form()
        with self.client:
            response = self.add_vendor_post(vendor.id, form, "wrongtoken")
            self.assertEqual(response.status_code, 401)

            response = self.add_vendor_post(vendor.id, form, None)
            self.assertEqual(response.status_code, 401)


    def test_get_post_authorized(self):
        vendor = Vendor.add_vendor(dict(email="test1@gmail.com",
                                        password="test1", name="vendor1"))

        form = get_test_post_form()
        p1 = Post.add_post(vendor.id, form)
        self.assertIsNotNone(p1)

        form["menu"] = "pumpkin pie"
        p2 = Post.add_post(vendor.id, form)
        self.assertIsNotNone(p2)

        with self.client:
            response = self.get_vendor_post(vendor.id, 2, vendor.encode_auth_token())
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.json), 2)


    def test_get_post_empty(self):
        vendor = Vendor.add_vendor(dict(email="test1@gmail.com",
                                        password="test1", name="vendor1"))
        with self.client:
            response = self.get_vendor_post(vendor.id, 1)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json, list())


    def test_get_post_invalid_args(self):
        vendor = Vendor.add_vendor(dict(email="test1@gmail.com",
                                        password="test1", name="vendor1"))
        form = get_test_post_form()
        p1 = Post.add_post(vendor.id, form)
        self.assertIsNotNone(p1)

        with self.client:
            response = self.get_vendor_post(vendor.id, "xxx")
            self.assertEqual(response.status_code, 400)

            response = self.get_vendor_post(vendor.id, -1)
            self.assertEqual(response.status_code, 400)


    def test_get_post_unauthorized(self):
        vendor = Vendor.add_vendor(dict(email="test1@gmail.com",
                                        password="test1", name="vendor1"))
        form = get_test_post_form()
        p1 = Post.add_post(vendor.id, form)
        self.assertIsNotNone(p1)

        form["menu"] = "pumpkin pie"
        p2 = Post.add_post(vendor.id, form)
        self.assertIsNotNone(p2)

        with self.client:
            response = self.get_vendor_post(vendor.id, 2)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.json), 1)

            self.assertEqual(response.json[0].get("menu"), form["menu"])
            self.assertEqual(response.json[0], form)




    def register_vendor(self, email, password, name):
        return self.client.post(
            "/vendor",
            data=dict(email=email, password=password, name=name))

    def get_vendor_post(self, vendor_id, num, token=None):
        if token:
            return self.client.get("/vendor/" + str(vendor_id) + "/post",
                                   query_string=dict(num=num),
                                   headers=dict(Authorization=token))
        return self.client.get("/vendor/" + str(vendor_id) + "/post",
                               query_string=dict(num=num))

    def add_vendor_post(self, vendor_id, form, token):
        if token:
            return self.client.post("/vendor/" + str(vendor_id) + "/post",
                                    data=form,
                                    headers=dict(Authorization=token))
        return self.client.post("/vendor/" + str(vendor_id) + "/post", data=form)

if __name__ == "__main__":
    unittest.main()
