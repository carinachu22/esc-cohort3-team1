# Backend Testing
## Setting up for bakend test
### Step 1: `npm install` in `/tenant-landlord-app/backend`
### Step 2: Create test database environment
In `/backend/.env`, define your testing database.
```
NODE_ENV =  "test"
DB_TESTPORT = 
DB_TESTHOST = 
DB_TESTUSER = 
DB_TESTPASSWORD = 
DB_TESTMYSQL = 
```
#### `NODE_ENV`
`NODE_ENV` is used to control which datbase you want to use. If `NODE_ENV = "test"`, the test database will be used. Else, development database will be used. To run on development database, you can just leave `NODE_ENV` to be an empty string.

Note that during testing the database will be set up with dummy data and then torn down afterwards. If you run on development database the data will be truncated and no data will be left in the database.

## How to run backend testing code

### Step 1: Navigate to `__test__`

Run `npm test <folder/filename>`

Example: To run tenant_model.test.js

```
cd tenant-landlord-app/backend/__test_
npm test models/tenant_model.test.js
```
If you just want to run that one specific test case, add a "`.only`" after the `test`.
Example:
```
test.only("Only this test will be run", () => {
    // sample code
})
```
The same can be done for test suites with the `describe`.

### Step 2: Check test cases

Check that all test cases passed.