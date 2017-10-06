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

