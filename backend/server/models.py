# server/models.py

from . import app, db, bcrypt
import datetime
import sys
import jwt


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


class Post(db.Model):
    """ User Model for storing user related details """
    __tablename__ = "posts"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    vendor_id = db.Column(
        db.Integer, db.ForeignKey("vendors.id"), nullable=False)
    location = db.Column(db.String(500), nullable=False)
    time = db.Column(db.String(500), nullable=False)
    menu = db.Column(db.String(500), nullable=True)
    posted_on = db.Column(db.DateTime, nullable=False)

    def __init__(self, vendor_id, location, time, menu=None):
        self.vendor_id = vendor_id
        self.location = location
        self.time = time
        if menu:
            self.menu = menu
        self.posted_on = datetime.datetime.now()

    @staticmethod
    def add_post(vendor_id, form):
        try:
            post = Post(
                vendor_id=vendor_id,
                location=form.get("location"),
                time=form.get("time"),
                menu=form.get("menu"))
            db.session.add(post)
            db.session.commit()
        except Exception as e:
            print e
            return None

        return post

    @staticmethod
    def get_latest_post(vendor_id):
        post = Post.query.filter_by(
            vendor_id=vendor_id).order_by(Post.posted_on)[1]
        return post

    @staticmethod
    def get_post_list():
        # TODO(amy): only latest from vendors
        posts = Post.query.all()
        return posts


class BlacklistToken(db.Model):
    __tablename__ = 'blacklist_tokens'

    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    blacklisted_on = db.Column(db.DateTime, nullable=False)

    def __init__(self, token):
        self.token = token
        self.blacklisted_on = datetime.datetime.now()

    def __repr__(self):
        return '<id: token: {}'.format(self.token)

    @staticmethod
    def check_blacklist(auth_token):
        res = BlacklistToken.query.filter_by(token=str(auth_token)).first()
        if res:
            return True
        else:
            return False
