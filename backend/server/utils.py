from views import Vendor
from flask import request


def auth_policy(request):
    # TODO(amy): change to middleware/decorator
    unkown_policy = {"role": "unknown"}
    auth_header = request.headers.get("Authorization")
    print "Auth token: ", auth_header
    if auth_header:
        try:
            auth_token = auth_header.split(" ")[0]
            if auth_token:
                resp = Vendor.decode_auth_token(auth_token)
                if not isinstance(resp, str):
                    policy = {"role": "vendor", "vendor_id": resp}
                    return policy
        except IndexError:
            pass
    return unkown_policy
