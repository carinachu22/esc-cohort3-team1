const {By, Builder, Browser} = require('selenium-webdriver');
const {suite} = require('selenium-webdriver/testing');
const assert = require("assert");


suite(function (env) {
    describe('Login', function () {
      let driver;
  
      before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
      });
  
      after(async () => await driver.quit());
  
      it('Landlord login', async function () {
        await driver.get('http://localhost:3000/pages/LoginPage');
  
        let title = await driver.getTitle();
        assert.equal("React App", title);
  
        // await driver.manage().setTimeouts({implicit: 500});
  
        // let textBoxEmail = await driver. find_element_by_css_selector('[data-testid="text-email"]');
        // let textBoxPassword = await driver. find_element_by_css_selector('[data-testid="text-password"]');
        // let loginButton = await driver. find_element_by_css_selector('[data-testid="login-button"]');
        // // let textBoxEmail = await driver.findElement(By.className('[data-testid="textEmail]'));
        // // let textBoxEmail = await driver.findElement(By.xpath("//input[@id=email"))
        // // let textBoxPassword = await driver.findElement(By.id('password'));
        // // let loginButton = await driver.findElement(By.id('loginButton'));
  
        // await textBoxEmail.sendKeys('john123@gmail.com');
        // await textBoxEmail.sendKeys('password');
        // await loginButton.click();

        // await driver. findElement(By.CSS_SELECTOR, '[data-testid="text-email"]').sendKeys('john123@gmail.com');
        // await driver. findElement(By.CSS_SELECTOR, '[data-testid="text-password"]').sendKeys('password');
        // await driver. findElement(By.CSS_SELECTOR, '[data-testid="login-button"]').click();


        // await driver. findElement(By.cssSelector('[data-testid="text-email"]')).sendKeys('john123@gmail.com');
        // await driver. findElement(By.cssSelector('[data-testid="text-password"]')).sendKeys('password');
        // await driver. findElement(By.cssSelector('[data-testid="login-button"]')).click();

        // // let new_title = await driver.getTitle()

        // let message = await driver.findElement(By.id('message'));
        // let value = await message.getText();
        // assert.equal("Received!", value);;
      });
    });
  }, { browsers: [Browser.FIREFOX]});