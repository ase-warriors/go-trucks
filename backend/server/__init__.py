# server/__init__.py

import os

import logging
from flask import Flask, render_template
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(
    import_name=__name__,
    static_url_path="/static",
    static_folder="./../../frontend/static/")
CORS(app)


@app.route("/")
def index():
    return render_template('index.html')


app_settings = os.getenv('APP_SETTINGS', 'server.config.DevelopmentConfig')
app.config.from_object(app_settings)
app.logger.setLevel(logging.DEBUG)

bcrypt = Bcrypt(app)
db = SQLAlchemy(app)

from server.middleware import AuthPolicy
app.wsgi_app = AuthPolicy(app.wsgi_app)

from server.views import vendor_bp, auth_bp, post_bp
app.register_blueprint(vendor_bp)
app.register_blueprint(post_bp)
app.register_blueprint(auth_bp)
