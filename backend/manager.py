""" Manager.py runs commands to run server and create/destroy db."""

import os
import unittest
import coverage

from flask_script import Manager
from server import app, db

manager = Manager(app)

COV = coverage.coverage(
    branch=True,
    include="server/*",
    omit=[
        "server/*/__init__.py"
    ]
)
COV.start()

@manager.command
def create_db():
    db.create_all()

@manager.command
def drop_db():
    db.drop_all()

@manager.command
def test():
    tests = unittest.TestLoader().discover('./tests', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=1).run(tests)
    if result.wasSuccessful():
        return 0
    return 1

@manager.command
def cov():
    tests = unittest.TestLoader().discover('./tests', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        COV.stop()
        COV.save()
        print("Coverage Summary:")
        COV.report()
        basedir = os.path.abspath(os.path.dirname(__file__))
        covdir = os.path.join(basedir, 'coverage')
        COV.html_report(directory=covdir)
        COV.erase()
        return 0
    return 1



if __name__ == "__main__":
    manager.run()
