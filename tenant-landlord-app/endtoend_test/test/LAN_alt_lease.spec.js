const { By, Builder, Browser, until } = require('selenium-webdriver');
const chai = require('chai');

// Use Chai assertion styles (e.g., "assert.equal")
const assert = chai.assert;

describe('Landlord Lease', function () {
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

      it('Landlord views Account Management', async function() {
        // Click "Account MAnagement"
        let account_management = await driver.wait(until.elementIsVisible(
          driver.findElement(By.xpath('//*[@id="root"]/div/div/div[1]/div[1]/div[4]/a'))
        ));
        await account_management.click();

        const currentURL = await driver.getCurrentUrl();
        assert.equal("http://localhost:3000/pages/AccountManagement", currentURL);
      });
    

      it('Enter create new tenant page', async function() {
        // Click "create tenant" button
        let create_tenant_button = await driver.wait(until.elementIsVisible(
          driver.findElement(By.xpath('//*[@id="root"]/div/div/div[2]/div[1]/button'))
        ));
        await create_tenant_button.click();

        const currentURL = await driver.getCurrentUrl();
        assert.equal("http://localhost:3000/pages/TenantCreationPage", currentURL);
      });


      it('Create new tenant -- with same email as existing tenant' , async function() {
        // input email and password
        let email = await driver.wait(until.elementIsVisible(
          driver.findElement(By.xpath('//*[@id="email"]'))
        ));
        await email.sendKeys("newtenant@gmail.com");
        let password = await driver.wait(until.elementIsVisible(
        driver.findElement(By.xpath('//*[@id="password"]'))
        ));
        await password.sendKeys("password");
        let create_button = await driver.wait(until.elementIsVisible(
          driver.findElement(By.xpath('//*[@id="loginButton"]'))
        ));
        await create_button.click();

        const currentURL = await driver.getCurrentUrl();
        assert.equal("http://localhost:3000/pages/TenantCreationPage", currentURL);
      });


});

