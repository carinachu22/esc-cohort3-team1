# How to run tests

## Install firefox browser
## Install selenium web driver
```
npm install selenium-webdriver
```

## Install mocha
Install as a deveopment dependency for the project:
```
npm install --save-dev mocha
```
For mochawesome report (in HTML format):
```
npm install mochawesome mochawesome-report-generator --save-dev
```
run test in ../test:
```
mocha firstScript.spec.js
```
run all tests in ../endtoend_test:
```
npm test
```


## Selenium Documentation
https://www.selenium.dev/documentation/webdriver/