# server/models.py

from . import app, db, bcrypt
import datetime
import sys


class Vendor(db.Model):
    """ User Model for storing user related details """
    __tablename__ = "vendors"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    registered_on = db.Column(db.DateTime, nullable=False)

    def __init__(self, email, password):
        self.email = email
        self.password = bcrypt.generate_password_hash(
            password, app.config.get('BCRYPT_LOG_ROUNDS')).decode()
        self.registered_on = datetime.datetime.now()

    @staticmethod
    def vendor_exists(email):
        vendor = Vendor.query.filter_by(email=email).first()
        if not vendor:
            return False
        return True

    @staticmethod
    def add_vendor(form):
        try:
            vendor = Vendor(
                email=form.get("email"), password=form.get("password"))
            db.session.add(vendor)
            db.session.commit()
        except Exception as e:
            return None

        return vendor

    @staticmethod
    def get_vendor_list():
        vendors = Vendor.query.all()
        return vendors

    @staticmethod
    def get_vendor(vendor_id):
        vendor = Vendor.query.filter_by(id=vendor_id).first()
        return vendor
