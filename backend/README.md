FoodTracker Backend
===========================
Project for ASE, Fall 2017

![CI](https://travis-ci.org/AmyJiang/ase_backend.svg?branch=master)

## Setup and Run Server

Prerequisite: python-2.7, pip, postgresql

```
# Get repo and dependencies in virtualenv workspace  (first time)
$ git clone https://github.com/AmyJiang/ase_backend
$ cd ase_backend/
$ pip install -r requirements.txt

# Create PostgreSQL database (first time)
$ psql -c ‘create database foodtracker_dev;’ -U postgres
$ python manager.py create_db

# Run server
$ python manager.py runserver
```

## Test Server

```
# Create PostgreSQL database (first time)
$ psql -c ‘create database foodtracker_test;’ -U postgres
$ python manager.py create_db

# Run tests
$ python manager.py test
```

## Rest API

### Vendor
* POST /vendor
  * {form=dict(email=string, password=string)}
  * returns {"status": "success", "id": vendor.id}, 200
  * returns {"status": "failure", "message": "User already exists."}, 202
  * returns {"status": "failure", "message": "Error occurred"}, 401

* GET  /vendor/<int:vendor_id>
  * returns  {"vendor_id": vendor.id, "email": vendor.email, "registered_on": vendor.registered_on}, 200
  * returns {"status": "failure", "message": "Error occurred"}, 401

* POST /vendor/<int:vendor_id>/post
  * {form=dict(location=string, time=string, menu=string(optional)), headers=dict(Authorization=token)}
  * returns {"status": "success", "message": "New post is added."}, 200
  * returns {"status": "failure", "message": "Error occurred"}, 401

* GET /vendor/<int:vendor_id>/post
  * returns {"location": "xxx", "time": "New post is added."}, 200
  * returns {"status": "failure", "message": "Error occurred"}, 401
  * currently returns the latest post from vendor
  * TODO: add parameter #posts to return



### Post
* GET  /post
  * returns \[{"vendor_id": vendor_id, "location": location, "time": time}\], 200
  * returns {"status": "failure", "message": "Error occurred"}, 402



### Auth
* POST /auth/login
  * {form=dict(email=string, password=string)}
  * returns {'auth_token':jwt_token, 'status': 'success', 'message': 'Successfully logged in.'}, 200
  * returns {'status': 'failure', 'message': 'User does not exist.'}, 404
  * returns {'status': 'failure', 'message': 'Try again'}, 500

* POST /auth/logout
  * returns {'status': 'success', 'message': 'Successfully logged out.'}, 200
  * returns {'status': 'failure', 'message': resp}, 401
  * returns {'status': 'failure',  'message': 'Provide a valid auth token.'}, 403
