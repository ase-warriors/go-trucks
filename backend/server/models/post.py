# server/models/post.py

import datetime
from server import app, db
from sqlalchemy.dialects.postgresql import DOUBLE_PRECISION


class Post(db.Model):
    """ User Model for storing user related details """
    __tablename__ = "posts"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    vendor_id = db.Column(
        db.Integer, db.ForeignKey("vendors.id"), nullable=False)
    location = db.Column(db.String(500), nullable=False)
    lat = db.Column(DOUBLE_PRECISION, nullable=False)
    lng = db.Column(DOUBLE_PRECISION, nullable=False)

    # TODO(amy): type of time? length of location?
    time = db.Column(db.Text, nullable=False)
    menu = db.Column(db.Text, nullable=True)
    posted_on = db.Column(db.DateTime, nullable=False)

    def __init__(self, vendor_id, location, lat, lng, time, menu=None):
        self.vendor_id = vendor_id
        self.location = location
        self.lat = lat
        self.lng = lng
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
                lat=form.get("lat"),
                lng=form.get("lng"),
                time=form.get("time"),
                menu=form.get("menu"))
            db.session.add(post)
            db.session.commit()
        except Exception as e:
            print e
            return None

        return post

    @staticmethod
    def get_latest_post(vendor_id, number):
        # TODO(amy): not sure about the query
        post = Post.query.filter_by(vendor_id=vendor_id).order_by(
            Post.posted_on.desc()).limit(number).all()
        return post

    @staticmethod
    def get_post_list(lat, lng, distance):
        # TODO(amy): only latest post from vendor_id
        posts = Post.query.from_statement(
            db.text(
                "SELECT * FROM posts "
                "WHERE earth_box(ll_to_earth(:lat, :lng), :distance) @> ll_to_earth(lat, lng);"
            ).params(lat=lat, lng=lng, distance=distance)).all()
        return posts
