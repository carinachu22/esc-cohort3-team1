const {By, Builder, Browser, until} = require('selenium-webdriver');
const chai = require('chai');

// Use Chai assertion styles (e.g., "assert.equal")
const assert = chai.assert;
  // var driver;
describe('Login', function () {
    let driver;
    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
      });
    after(async () => {await driver.quit();});
  
      
    it('Select Tenant Option', async function () {
      await driver.get('http://localhost:3000/');

      let title = await driver.getTitle();
      assert.equal("React App", title);

      // In first page
      let tenantButton = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/div/button[1]'))));
      await tenantButton.click();

      // In Tenant Login Page
      let loginText = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/form/div/h2"))));
      let result = await loginText.getText();
      assert.equal("Welcome tenant!", result);
    });
  
    it('Tenant login', async function () {

      // Sign in details: email, password, button
      let email_in = await driver.wait(until.elementIsVisible(
        driver.findElement(By.xpath('//*[@id="email"]'))));
      await email_in.sendKeys('tenant1@gmail.com');

      let pw_in = await driver.wait(until.elementIsVisible(
        driver.findElement(By.xpath('//*[@type="password"]'))));
      await pw_in.sendKeys('password');

      let submit_button = await driver.wait(until.elementIsVisible(
        driver.findElement(By.xpath('//*[@type="submit"]'))));
      await submit_button.click();


       await driver.manage().setTimeouts({implicit: 1000});

      // In Tenant Dashboard
      let next_pg = await driver.wait(until.elementIsVisible(
        driver.findElement(By.xpath('//*[@id="emailText"]'))));
      let result = await next_pg.getText();
      assert.equal("Welcome, tenant1@gmail.com", result);
    });


    it('Tenant View Service Tickets', async function () {

      // Click on "Service Ticket List"
      let ticket_list = await driver.wait(until.elementIsVisible(
        driver.findElement(By.xpath('//*[@id="root"]/div/div/div[1]/div[1]/div[3]/a'))
      ))
      await ticket_list.click();
  
      // Check if ticket portal is shown
      const currentURL = await driver.getCurrentUrl();
      assert.equal('http://localhost:3000/pages/TicketList', currentURL)
    });


    it('Tenant Create Service Ticket', async function() {

      // Click on "Create Service Ticket"
      let create_service_ticket = await driver.wait(until.elementIsVisible(
        driver.findElement(By.xpath('//*[@id="root"]/div/div/div[1]/div[1]/div[4]/a'))
      ))
      await create_service_ticket.click();


      await driver.manage().setTimeouts({implicit: 1000});

      // Request Type
      let req_type = await driver.wait(until.elementIsVisible(
        driver.findElement(By.xpath('//*[@name="requestType"]'))
      ));
      await req_type.click();
      let sel_dropdown= await driver.wait(until.elementIsVisible(
        driver.findElement(By.xpath(`//select[@name="requestType"]/option[2]`))
      ));
      await sel_dropdown.click();

      // Request Description
      let description= await driver.wait(until.elementIsVisible(
        driver.findElement(By.xpath('//*[@id="tenantComment"]'))
      ));
      await description.sendKeys("Aircon is leaking");

      await driver.executeScript("window.scrollBy(0,250)", "");

      // Submit Button
      let submit= await driver.wait(until.elementIsVisible(
        driver.findElement(By.xpath('//*[@name="submitButton"]'))
      ));
      await submit.click();
        
      await driver.sleep(1000)
      await driver.manage().setTimeouts({implicit: 2000});

      // Check if it enters dashboard again
      const currentURL = await driver.getCurrentUrl();
      assert.equal('http://localhost:3000/pages/Dashboard', currentURL)
      });

      
    it('Sign Out', async function () {

      // Click on "Service Ticket List"
      let signout = await driver.wait(until.elementIsVisible(
        driver.findElement(By.xpath('//*[@id="root"]/div/div/div[1]/div[3]/button'))
      ))
      await signout.click();
      await driver.manage().setTimeouts({implicit: 500});
  
      // Check if ticket portal is shown
      const currentURL = await driver.getCurrentUrl();
      assert.equal('http://localhost:3000/', currentURL)
    });


    
  });

