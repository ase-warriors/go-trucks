import unittest

from server.models import BlacklistToken
from server import db
from tests.base import BaseTestCase

class TestTokenModel(BaseTestCase):
  def test_add_token(self):
    example_token = "token"
    token = BlacklistToken(token=example_token)
    db.session.add(token)
    db.session.commit()
    self.assertTrue(BlacklistToken.check_blacklist(example_token))

if __name__ == "__main__":
    unittest.main()
