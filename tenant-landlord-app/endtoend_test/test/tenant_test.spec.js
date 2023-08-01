const {By, Builder, Browser, until} = require('selenium-webdriver');
const {suite} = require('selenium-webdriver/testing');
const assert = require("assert");
const { WebElement } = require('selenium-webdriver');




    describe('Login', function () {
      let driver;
  
      before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
      });
  
      after(async () => await driver.quit());

      it('Select Tenant Option', async function () {
        await driver.get('http://localhost:3000/');

        let title = await driver.getTitle();
        assert.equal("React App", title);

        await driver.manage().setTimeouts({implicit: 300});

        // In first page
        await driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/div/button[1]")).click();

        await driver.manage().setTimeouts({implicit: 500});

        // In Tenant Login Page
        let result =  await driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/form/div/h2")).isDisplayed();
        assert.equal(true, result)

      });
  
      it('Tenant login', async function () {
        await driver.get('http://localhost:3000/pages/LoginPage');
  
        let title = await driver.getTitle();
        assert.equal("React App", title);
  
        await driver.manage().setTimeouts({implicit: 300});

        await driver.findElement(By.xpath('//*[@id="email"]')).sendKeys('tenant1@gmail.com');
        await driver.findElement(By.xpath('//*[@id="password"]')).sendKeys('password');
        await driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/form/div/div[3]')).click();

        await driver.manage().setTimeouts({implicit: 800});

        // In Tenant Dashboard
        let result =  await driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/form/div/div[3]")).isDisplayed();
        assert.equal(true, result)
      });

      it('Tenant View Service Tickets', async function () {
        await driver.get('http://localhost:3000/pages/Dashboard/');

        let title = await driver.getTitle();
        assert.equal("React App", title);

        await driver.manage().setTimeouts({implicit: 300});
        
        //TODO - tenant can view tickets
        
      });

      it('Tenant Create Service Ticket', async function() {
        await driver.get('http://localhost:3000/pages/CreateTicketPage/');

        let title = await driver.getTitle();
        assert.equal("React App", title);

        await driver.manage().setTimeouts({implicit: 1000});

         //TODO - tenant can create tickets
        // // Location
        // await driver.findElement(By.xpath('//*[@id="root"]/div/div/form/div/div[1]/div[1]/textarea')).sendKeys("Next to escalator 2A");
        // // Request Type
        // await driver.findElement(By.xpath("//*[@id='root']/div/div/form/div/div[1]/div[1]/div/div/svg")).click();
        // await driver.manage().setTimeouts({implicit: 200});
        // await driver.findElement(By.xpath("//*[@id='root']/div/div/form/div/div[1]/div[1]/div/select/option[2]")).click();

        // // Request Description
        // await driver.findElement(By.xpath("//*[@id='root']/div/div/form/div/div[1]/div[2]/textarea")).sendKeys("Aircon is leaking");
        // await driver.manage().setTimeouts({implicit: 200});

        // // Submit Button
        // await driver.findElement(By.xpath("//*[@id='root']/div/div/form/div/div[2]/button")).click();
        
        // // await driver.manage().setTimeouts({implicit: 500});

        // // // In Ticket Creation
        // // let result =  await driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/form/div/div[3]")).isDisplayed();
        // // assert.equal(true, result)
        // // awai
        


      });
    });