# ASE Toy Project

## Build Status
[![Build Status](https://travis-ci.org/ase-warriors/toyproject.svg?branch=master)](https://travis-ci.org/ase-warriors/toyproject)

## Description
This is a toy project demonstrating the technology framework we are going to use for our final project. We added continuous integration with Travis-CI.

## Building and Testing
### Build the frontend and backend
```bash
npm install
npm run-script build
```

### Run the backend
```bash
./install_db.sh
npm run-script run
```

### Unit test
```bash
./unit_test.sh
```

### Frontend
* react.js
* Bootstrap (react-bootstrap)
* webpack
* babel-es2015 & babel-react
* d3.js

### Backend (for test-only)
* nodejs (6)
* express
* pg
* postgreSQL

The actual backend we are going to use is:
https://github.com/AmyJiang/ase_backend

## Authors
Andy Xu (lx2180)
Wendy Pan (wp2213)
