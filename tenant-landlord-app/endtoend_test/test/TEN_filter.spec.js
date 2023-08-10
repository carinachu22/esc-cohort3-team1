const {By, Builder, Browser, until} = require('selenium-webdriver');
const chai = require('chai');

const assert = chai.assert;

describe('Tenant Filter Tickets', function () {
    var tenant_driver;
    var landlord_driver

    before(async function () {
        tenant_driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {await tenant_driver.quit();});

    it('Select Tenant Option', async function () {
        await tenant_driver.get('http://localhost:3000/');
  
        let title = await tenant_driver.getTitle();
        assert.equal("React App", title);
  
        // In first page
        let tenantButton = await tenant_driver.wait(until.elementIsVisible(
            tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/div/button[1]'))));
        await tenantButton.click();
  
        // In Tenant Login Page
        let loginText = await tenant_driver.wait(until.elementIsVisible(
            tenant_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/form/div/h2"))));
        let result = await loginText.getText();
        assert.equal("Welcome tenant!", result);
      });
    

    it('Tenant login', async function () {
  
        // Sign in details: email, password, button
        let email_in = await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@id="email"]'))));
        await email_in.sendKeys('tenant1@gmail.com');
  
        let pw_in = await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@type="password"]'))));
        await pw_in.sendKeys('password');
  
        let submit_button = await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@type="submit"]'))));
        await submit_button.click();
  
         await tenant_driver.manage().setTimeouts({implicit: 1000});
  
        // In Tenant Dashboard
        let next_pg = await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@id="emailText"]'))));
        let result = await next_pg.getText();
        assert.equal("Welcome, tenant1@gmail.com", result);
    });


    it('Tenant Create Service Ticket -- Aircon', async function() {

        // Click on "Create Service Ticket"
        let create_service_ticket = await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div[1]/div[1]/div[4]/a'))
        ))
        await create_service_ticket.click();
  
  
        await tenant_driver.manage().setTimeouts({implicit: 1000});
  
        // Request Type
        let req_type = await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@name="requestType"]'))
        ));
        await req_type.click();
        let sel_dropdown= await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath(`//select[@name="requestType"]/option[2]`))
        ));
        await sel_dropdown.click();
  
        // Request Description
        let description= await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@id="tenantComment"]'))
        ));
        await description.sendKeys("Aircon is freezing");
  
        await tenant_driver.executeScript("window.scrollBy(0,250)", "");
  
        // Submit Button
        let submit= await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@name="submitButton"]'))
        ));
        await submit.click();
          
        await tenant_driver.sleep(1000)
        await tenant_driver.manage().setTimeouts({implicit: 2000});
  
        // Check if it enters dashboard again
        const currentURL = await tenant_driver.getCurrentUrl();
        assert.equal('http://localhost:3000/pages/Dashboard', currentURL)
    });

    it('Tenant Create Service Ticket -- Cleanliness', async function() {

        // Click on "Create Service Ticket"
        let create_service_ticket = await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div[1]/div[1]/div[4]/a'))
        ))
        await create_service_ticket.click();
  
  
        await tenant_driver.manage().setTimeouts({implicit: 1000});
  
        // Request Type
        let req_type = await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@name="requestType"]'))
        ));
        await req_type.click();
        let sel_dropdown= await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath(`//select[@name="requestType"]/option[3]`))
        ));
        await sel_dropdown.click();
  
        // Request Description
        let description= await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@id="tenantComment"]'))
        ));
        await description.sendKeys("The area is quite dirty");
  
        await tenant_driver.executeScript("window.scrollBy(0,250)", "");
  
        // Submit Button
        let submit= await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@name="submitButton"]'))
        ));
        await submit.click();
          
        await tenant_driver.sleep(1000)
        await tenant_driver.manage().setTimeouts({implicit: 2000});
  
        // Check if it enters dashboard again
        const currentURL = await tenant_driver.getCurrentUrl();
        assert.equal('http://localhost:3000/pages/Dashboard', currentURL)
    });


    it('check ticket type filter', async function() {
      // await tenant_driver.sleep(1000);
      await tenant_driver.get('http://localhost:3000/pages/TicketList');
  
      let search_requester = await tenant_driver.wait(until.elementIsVisible(
          tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div[3]/div/input'))
      ));
      await search_requester.sendKeys("Cleanliness");

      let last_requester = await tenant_driver.wait(until.elementIsVisible(
        tenant_driver.findElement(By.xpath('//*[@id="accordion-button-:r0:"]/div/div[3]'))
        ));
      let text = await last_requester.getText();

      assert.equal('Cleanliness', text);

      // Return back to normal
      let clear_button =  await tenant_driver.wait(until.elementIsVisible(
        tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div[3]/div/div/button'))));
      await clear_button.click();
    });


    it('Tenant Sign Out', async function () {
      // Click on "Service Ticket List"
      let signout = await tenant_driver.wait(until.elementIsVisible(
        tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div[1]/div[3]/button'))
      ))
      await signout.click();
      await tenant_driver.manage().setTimeouts({implicit: 500});
  
      // Check if ticket portal is shown
      const currentURL = await tenant_driver.getCurrentUrl();
      assert.equal('http://localhost:3000/', currentURL)
    });



});