# React Testing Library Unit Testing Guide 
## Download depenencies 
Please run `npm install` in the /tenant-landlord-app directory. You should have a new node_modules folder. 

## Viewing of Unit Test code 
Please go to /tenant-landlord-app/src/__tests__ 

## Set up files 
Just for understanding, please do not make changes to them 
setupTests.js: This is to make a customised render based on chakra UI. 
./__mocks__react-router-dom.js: This makes a mock react-router-dom.js 

## Template for writing unit test cases
Please look at LoginPage.test.js for basic rendering of pages
Please look at Dashboard.test.js if you are writing test cases for pages that requires the login token. You need `jest.mock("react-auth-kit")` in your code to make a mock react-auth-kit.
