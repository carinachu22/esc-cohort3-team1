const { By, Builder, Browser, until } = require('selenium-webdriver');
const chai = require('chai');

// Use Chai assertion styles (e.g., "assert.equal")
const assert = chai.assert;

describe('Login', function () {
    let driver;

    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => await driver.quit());

    it('Select Landlord Option', async function () {
        await driver.get('http://localhost:3000/');
  
        let title = await driver.getTitle();
        assert.equal("React App", title);
  
        // In first page
        let landlordButton = await driver.wait(until.elementIsVisible(
            driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/div/button[2]"))));
        await landlordButton.click();
  
        // In Landlord Login Page
        let loginText = await driver.wait(until.elementIsVisible(
            driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/form/div/h2'))));
        let result = await loginText.getText();
        assert.equal("Welcome landlord!", result);
      });

      it('Landlord login', async function () {
  
        // Sign in details: email, password, button
        let email_in = await driver.wait(until.elementIsVisible(
          driver.findElement(By.xpath('//*[@id="email"]'))));
        await email_in.sendKeys('landlord1@gmail.com');
  
        let pw_in = await driver.wait(until.elementIsVisible(
          driver.findElement(By.xpath('//*[@type="password"]'))));
        await pw_in.sendKeys('password');
  
        let submit_button = await driver.wait(until.elementIsVisible(
          driver.findElement(By.xpath('//*[@type="submit"]'))));
        await submit_button.click();
  
         await driver.manage().setTimeouts({implicit: 1000});
  
        // In Landlord Dashboard
        let next_pg = await driver.wait(until.elementIsVisible(
          driver.findElement(By.xpath('//*[@id="emailText"]'))));
        let result = await next_pg.getText();
        assert.equal("Welcome, landlord1@gmail.com", result);
      });


});

