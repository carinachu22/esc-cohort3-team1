# How to run backend code

## Step 1: Download the following packages

I think you need to run a general `npm install` first. Ignore vulnerabilities issues.

Then, install the additional packages needed for backend
`npm install express jsonwebtoken bcrypt mysql2`

## Step 2: Fill in the information of your local sql server in .env file

Please do not change directly on files. All configuration will be done in .env file

## Step 3: cd to backend project directory

Run `node app.js`

## Step 4: Check if server is working and database is connected.

You should be able to see this in the console log

```
Server is working on port 3000
Connected to the database!
Test query executed successfully: [ { '1': 1 } ]
```

## Step 5: To check for API requests, use postman or thunderclient to view

The HTTP requests to make, please refer to app.js.

## Step 6: How to read app.js and router.js codes

For example, this is the most basic http request to check if API is working. For this, in postman, make sure its a GET request, and the url is http://localhost:3000/api. Run this first to check if api calls are working

```
app.get("/api", (req, res) => {
  res.json({
    success: 1,
    message: "This is a working REST API",
  });
});
```

### To read router.js codes:

This is in app.js `app.use("/api/landlord", landlordRouter);`
Then, we go to the landlord_router.js to see this codes:`router.post("/create", controllerCreateLandlord);`

It is a concatenation of both to get the relevant url for the HTTP request.
In this example, the HTTP request will be a POST http://localhost:3000/api/landlord/create
