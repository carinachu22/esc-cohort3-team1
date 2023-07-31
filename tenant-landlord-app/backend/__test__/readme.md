# Backend Testing

## How to run backend testing code

### Step 1: Navigate to `__test__`

Run `npm test <folder/filename>`

Example: To run tenant_model.test.js

```
cd tenant-landlord-app/backend/__test_
npm test models/tenant_model.test.js
```

### Step 2: Check test cases

Check that all test cases passed.

### Step 3: Restore database

Navigate to `/backend` folder and run `setup.js` file.

```
cd ..
node setup.js
```

This step is to restore the database entries to have dummy entries as running the test would teardown the database.
