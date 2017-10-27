# server/models/post.py

import datetime
from server import db


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
            vendor_id=vendor_id).order_by(Post.posted_on).limit(1)[0]
        return post

    @staticmethod
    def get_post_list():
        # TODO(amy): only latest from vendors
        posts = Post.query.all()

        return posts
