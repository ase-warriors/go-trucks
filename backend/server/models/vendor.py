# server/models/vendor.py

import datetime
import jwt
from server import app, db, bcrypt
from server.models.token import BlacklistToken


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
    def get_vendor_by_email(email):
        vendor = Vendor.query.filter_by(email=email).first()
        return vendor

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

    @staticmethod
    def decode_auth_token(auth_token):
        # return: integer or string
        # TODO(amy): change to error not string
        try:
            payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'))
            is_blacklisted = BlacklistToken.check_blacklist(auth_token)
            if is_blacklisted:
                return 'Token blacklisted. Please log in again.'
            else:
                return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'

    def encode_auth_token(self):
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + \
                       datetime.timedelta(days=0, seconds=100),
                'iat': datetime.datetime.utcnow(),
                'sub': self.id
            }
            return jwt.encode(
                payload, app.config.get('SECRET_KEY'), algorithm='HS256')
        except Exception as e:
            return e
