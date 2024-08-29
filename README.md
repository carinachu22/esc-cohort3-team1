# esc-cohort3-team1
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

Create 2 MySQL schemas `landlord_tenant_portal` and `testing_landlord_tenant_portal` <br>
Import MySQL tables into `landlord_tenant_portal` and `testing_landlord_tenant_portal` schemas <br>
Link: https://drive.google.com/file/d/1-E6-4RjQT3LWA-GsjMCXmqcBcCNo6M5d/view?usp=sharing <br>
Next, prepare `.env` inside backend folder and tenant-landlord-app (for testing) <br> 
Finally, run `npm start` in backend <br>
run `npm start` in tenant-landlord-app <br>
The application should be accessible through http://localhost:3000/ now <br>

## Testing
Have a `quotation.pdf` and a `lease.pdf` as a test pdf file <br>
Stop any running backend and run `npm run test-launch` in backend instead of `npm start` <br>
run `npm test` in tenant-landlord-app

## .env properties

APP_PORT - Port that the backend runs on, for example '5000' <br>
DB_PORT - Port that the database runs on, for example '3306' <br>
DB_HOST - IP that the database is hosted, for example "127.0.0.1" <br>
DB_USER - Username to login to database, for example "root" <br>
DB_PASSWORD - Password to login to database <br>
DB_MYSQL - Name of schema to use, for example  'landlord_tenant_portal' <br>


JWT_SECRET - Any secret key that only the app knows, to generate reset password links <br>
AUTH_USER - Email that will send out reset password links <br>
AUTH_PASSWORD - Third party password to login to the above email <br>


These properties are required for running npm test. <br>
DB_TESTPORT = '3306' <br>
DB_TESTHOST = '127.0.0.1' <br>
DB_TESTUSER = 'root' <br>
DB_TESTPASSWORD <br>
DB_TESTMYSQL = 'testing_landlord_tenant_portal' <br>


