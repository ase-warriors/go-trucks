import unittest

from flask_script import Manager, Server
from server import app, db

manager = Manager(app)

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

if __name__ == "__main__":
    manager.run()
