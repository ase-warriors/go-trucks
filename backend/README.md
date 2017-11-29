FoodTracker Backend
===========================
Project for ASE, Fall 2017

![CI](https://travis-ci.org/ase-warriors/go-trucks.svg?branch=master)

## Setup and Run Server

Prerequisite: python-2.7, pip, postgresql

```
# Get repo and dependencies in virtualenv workspace  (first time)
$ git clone https://github.com/AmyJiang/ase_backend
$ cd ase_backend/
$ pip install -r requirements.txt

# Create PostgreSQL database (first time)
$ psql -c ‘create database foodtracker_dev;’ -U postgres
$ psql -d foodtracker_dev -c ‘create extension cube;’ -U postgres
$ psql -d foodtracker_dev -c ‘create extension earthdistance;’ -U postgres
$ python manager.py create_db

# Run server
$ python manager.py runserver
```

For database scheme changes, must recreate both databases as follows
```
$ export APP_SETTINGS="server.config.TestingConfig"
$ python manager.py drop_db
$ python manager.py create_db
$ export APP_SETTINGS="server.config.DevelopmentConfig"
$ python manager.py drop_db
$ python manager.py create_db
```


## Test Server

```
# Create PostgreSQL database (first time)
$ psql -c ‘create database foodtracker_test;’ -U postgres
$ psql -d foodtracker_test -c ‘create extension cube;’ -U postgres
$ psql -d foodtracker_test -c ‘create extension earthdistance;’ -U postgres
$ python manager.py create_db

# Run tests
$ python manager.py test
```

## Rest API

### Vendor
* POST /vendor
  * To register a new vendor
  * {form=dict(email=string, password=string, name=string)}
  * returns {"status": "success", "id": vendor.id}, 200
  * returns {"status": "failure", "message": "User already exists."}, 202
  * returns {"status": "failure", "message": "Error occurred"}, 401

* GET  /vendor/<int:vendor_id>
  * To obtain vendor information
  * returns  {"vendor_id": vendor.id, "email": vendor.email, "name": vendor.name, "registered_on": vendor.registered_on}, 200
  * returns {"status": "failure", "message": "Error occurred"}, 401

* POST /vendor/<int:vendor_id>/post
  * To add a new vendor posting
  * with form = dict(location=string, lat=float, lng=float, time=string, menu=string(optional)), headers=dict(Authorization=token)
  * returns {"status": "success", "message": "New post is added."}, 200
  * returns {"status": "failure", "message": "Error occurred"}, 401

* GET /vendor/<int:vendor_id>/post?num=1
  * To get a list of vendor's (num)-th latest posts
  * num: number of latest posts
  * Only the vendor him/herself (with right token) can view more than one previous posts; others can only view the latest one
  * returns {"location", "time", "menu", "lat", "lng"}, 200
  * returns {"status": "failure", "message": "Error occurred"}, 401


### Post
* GET  /post?lat=40.8075355&lng=-73.9625727&distance=1.0
  * To get the latest postings near a location within some distance
  * distance: unit in mile
  * returns \[{"vendor_id", "vendor_name", "location", "lat", "lng", "time", "menu"}\], 200
  * returns {"status": "failure", "message": "Error occurred"}, 402
  * returns {"status": "failure", "message": "Invalid arguments"}, 400


### Auth
* POST /auth/login
  * To obtain the authentication token
  * {form=dict(email=string, password=string)}
  * returns {'auth_token':jwt_token, 'status': 'success', 'message': 'Successfully logged in.', 'vendor_id': vendor_id}, 200
  * returns {'status': 'failure', 'message': 'User does not exist.'}, 404
  * returns {'status': 'failure', 'message': 'Try again'}, 500

* POST /auth/logout
  * To logout a vendor session
  * returns {'status': 'success', 'message': 'Successfully logged out.'}, 200
  * returns {'status': 'failure', 'message': resp}, 401
  * returns {'status': 'failure',  'message': 'Provide a valid auth token.'}, 403

## TODO (1st Iteration)
* Feature

  * [x] Save (lattitude, longitude) to model Post; implement query by distance
  * [x] Move geocoder to frontend which passes (location, lattitude, longitude) back to server
  * [x] Return only the latest post of all users (within the requested distance) in `get_post_listing` in model Post
  * [x] Only the vendor him/herself can see previous posts; customer can only view the lastest one

* Bug fixs
