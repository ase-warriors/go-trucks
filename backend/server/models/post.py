# server/models/post.py

import datetime
from server import app, db
import geocoder
from sqlalchemy.dialects.postgresql import DOUBLE_PRECISION


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
    lat = db.Column(DOUBLE_PRECISION, nullable=False)
    lng = db.Column(DOUBLE_PRECISION, nullable=False)

    def __init__(self, vendor_id, location, lat, lng, time, menu=None):
        self.vendor_id = vendor_id
        self.location = location
        self.time = time
        if menu:
            self.menu = menu
        self.posted_on = datetime.datetime.now()
        self.lat = lat
        self.lng = lng

    @staticmethod
    def add_post(vendor_id, form):
        #TODO(amy): get longitue and lattitude of location and save to db
        try:
            lat, lng = Post.get_geoloc(form.get("location"))
            app.logger.debug("post location: %s -> %f, %f",
                             form.get("location"), lat, lng)
            post = Post(
                vendor_id=vendor_id,
                location=form.get("location"),
                lat=lat,
                lng=lng,
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
        post = Post.query.filter_by(
            vendor_id=vendor_id).order_by(Post.posted_on).limit(number)
        return post

    @staticmethod
    def get_post_list(location, distance):
        (lat, lng) = Post.get_geoloc(location)
        app.logger.debug("location: %s --> %f, %f", location, lat, lng)
        posts = Post.query.from_statement(
            db.text(
                "SELECT * FROM posts "
                "WHERE earth_box(ll_to_earth(:lat, :lng), :distance) @> ll_to_earth(lat, lng);"
            ).params(lat=lat, lng=lng, distance=distance)).all()
        return posts

    @staticmethod
    def get_geoloc(address):
        return geocoder.google(address).latlng
