# server/config.py

import os
basedir = os.path.abspath(os.path.dirname(__file__))
postgres_local_base = "postgresql://postgres:test@localhost/"
database_name = "foodtracker"


class BaseConfig:
    """Base configuration."""
    SECRET_KEY = os.getenv("SECRET_KEY", "secret")
    DEBUG = False
    BCRYPT_LOG_ROUNDS = 13
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(BaseConfig):
    DEBUG = True
    BCRYPT_LOG_ROUNDS = 4
    SQLALCHEMY_DATABASE_URI = postgres_local_base + database_name + "_dev"


class TestingConfig(BaseConfig):
    DEBUG = True
    TESTING = True
    BCRYPT_LOG_ROUNDS = 4
    SQLALCHEMY_DATABASE_URI = postgres_local_base + database_name + "_test"
