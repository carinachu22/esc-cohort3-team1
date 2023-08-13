# esc-cohort3-team1
## Github How-To

### Collaborating

First, clone the repository using `git clone`   
```
git clone https://github.com/Purritzo/esc-cohort3-team1.git
```

## Setting Up

`npm i` inside 3 folders:
1. tenant-landlord-app
2. backend
3. endtoend_test

Import MySQL tables into `landlord_tenant_portal` schema

Link: https://drive.google.com/file/d/1-E6-4RjQT3LWA-GsjMCXmqcBcCNo6M5d/view?usp=sharing

Next, prepare `.env` inside backend folder and tenant-landlord-app (for testing)

Finally, run `npm start` in backend

run `npm start` in tenant-landlord-app

The application should be accessible through http://localhost:3000/ now

## Testing
Create a new MySQL schema named `testing_landlord_tenant_portal`

run `npm run test-launch` in backend instead of `npm start`

run `npm test` in tenant-landlord-app

## .env properties

APP_PORT - Port that the backend runs on, for example '5000'
DB_PORT - Port that the database runs on, for example '3306'
DB_HOST - IP that the database is hosted, for example "127.0.0.1"
DB_USER - Username to login to database, for example "root"
DB_PASSWORD - Password to login to database
DB_MYSQL - Name of schema to use, for example  'landlord_tenant_portal'

JWT_SECRET - Any secret key that only the app knows, to generate reset password links 
AUTH_USER - Email that will send out reset password links
AUTH_PASSWORD - Third party password to login to the above email

These properties are required for running npm test.
DB_TESTPORT = '3306'
DB_TESTHOST = '127.0.0.1'
DB_TESTUSER = 'root'
DB_TESTPASSWORD
DB_TESTMYSQL = 'testing_landlord_tenant_portal'

