// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { By, Builder, Browser, until } = require('selenium-webdriver');
const chai = require('chai');
import setup from "../setup.js"
import teardown from "../teardown.js";


// Use Chai assertion styles (e.g., "assert.equal")
const assert = chai.assert;

describe('Landlord filter ticket', function () {
    let driver;
    let tenant_driver;

    before(async function () {
        await setup()
        driver = await new Builder().forBrowser('chrome').build();
        tenant_driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {
        await tenant_driver.quit();
        await driver.quit();
        await teardown()
      });

    it('Set up for testing -- tenant1@gmail.com', async function() {
        await tenant_driver.get('http://localhost:3000/');
  
        let title = await tenant_driver.getTitle();
        assert.equal("React App", title);
  
        // In first page
        let tenantButton = await tenant_driver.wait(until.elementIsVisible(
            tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/div/button[1]'))));
        await tenantButton.click();
  
        // In Tenant Login Page
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


        // Click on "Create Service Ticket"
        let create_service_ticket = await tenant_driver.wait(until.elementIsVisible(
            tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div[1]/div[1]/div[4]/a'))
        ));
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
        await description.sendKeys("Aircon is leaking");

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
        assert.equal('http://localhost:3000/pages/Dashboard', currentURL);

        // Sign out
        let signout = await tenant_driver.wait(until.elementIsVisible(
            tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div[1]/div[3]/button'))
        ))
        await signout.click();
        await tenant_driver.manage().setTimeouts({implicit: 500});

    });

    it('Set up for testing -- tenant2@gmail.com', async function() {
        await tenant_driver.get('http://localhost:3000/');
  
        let title = await tenant_driver.getTitle();
        assert.equal("React App", title);
  
        // In first page
        let tenantButton = await tenant_driver.wait(until.elementIsVisible(
            tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/div/button[1]'))));
        await tenantButton.click();
  
        // In Tenant Login Page
        // Sign in details: email, password, button
        let email_in = await tenant_driver.wait(until.elementIsVisible(
            tenant_driver.findElement(By.xpath('//*[@id="email"]'))));
        await email_in.sendKeys('tenant2@gmail.com');
    
        let pw_in = await tenant_driver.wait(until.elementIsVisible(
            tenant_driver.findElement(By.xpath('//*[@type="password"]'))));
        await pw_in.sendKeys('password');
    
        let submit_button = await tenant_driver.wait(until.elementIsVisible(
            tenant_driver.findElement(By.xpath('//*[@type="submit"]'))));
        await submit_button.click();
    
        await tenant_driver.manage().setTimeouts({implicit: 1000});


        // Click on "Create Service Ticket"
        let create_service_ticket = await tenant_driver.wait(until.elementIsVisible(
            tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div[1]/div[1]/div[4]/a'))
        ));
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
        await description.sendKeys("Aircon is not cold");

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
        assert.equal('http://localhost:3000/pages/Dashboard', currentURL);

        // Sign out
        let signout = await tenant_driver.wait(until.elementIsVisible(
            tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div[1]/div[3]/button'))
        ))
        await signout.click();
        await tenant_driver.manage().setTimeouts({implicit: 500});

    });


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


    it('Landlord View Service Tickets', async function () {
        // Click on "Service Ticket List"
        let ticket_list = await driver.wait(until.elementIsVisible(
            driver.findElement(By.xpath('//*[@id="root"]/div/div/div[1]/div[1]/div[3]/a'))
        ))
        await ticket_list.click();
  
        // Check if ticket portal is shown
        const currentURL = await driver.getCurrentUrl();
        assert.equal('http://localhost:3000/pages/TicketList', currentURL)
    });


    it('Filter by Requester', async function() {
        let search_requester = await driver.wait(until.elementIsVisible(
            driver.findElement(By.xpath('//*[@id="root"]/div/div/div[2]/div/input'))
        ));
        await driver.sleep(1000)
        await search_requester.sendKeys("tenant1@gmail.com")

        await driver.sleep(1000)

        await driver.manage().setTimeouts({ implicit: 500 });

        // Find ticket
        const lastTicket = driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]"));
        await driver.executeScript("arguments[0].click();", lastTicket);

        await driver.manage().setTimeouts({ implicit: 500 });

        const last_requester = driver.findElement(By.xpath('//*[@id="accordion-button-:r0:"]/div/div[2]'))
        await driver.sleep(2000)
        await driver.wait(until.elementIsVisible(last_requester))
        const text = await last_requester.getText();

        assert.equal('tenant1@gmail.com', text);

        // Return back to normal
        let clear_button =  await driver.wait(until.elementIsVisible(
          driver.findElement(By.xpath('//*[@id="root"]/div/div/div[2]/div/div/button'))));
        await clear_button.click();
    });


    it('Filter by Status (Created)', async function() {
      let search_requester = await driver.wait(until.elementIsVisible(
          driver.findElement(By.xpath('//*[@id="root"]/div/div/div[4]/div/select'))
      ));
      await driver.sleep(1000)
      await search_requester.click();

      await driver.sleep(1000)

      let click_status = await driver.wait(until.elementIsVisible(
        driver.findElement(By.xpath('//*[@id="root"]/div/div/div[4]/div/select/option[2]'))
      ));
      await click_status.click();

      await driver.sleep(2000)
      const last_requester = driver.findElement(By.xpath('//*[@id="accordion-button-:r0:"]/div/div[4]'))
      
      await driver.wait(until.elementIsVisible(last_requester))
      const text = await last_requester.getText();

      assert.equal('Created', text);

      // Return back to normal
      let search_requester_return = await driver.wait(until.elementIsVisible(
        driver.findElement(By.xpath('//*[@id="root"]/div/div/div[4]/div/select'))
      ));
      await driver.sleep(1000)
      await search_requester_return.click();

      await driver.sleep(1000)

      let click_status_return = await driver.wait(until.elementIsVisible(
        driver.findElement(By.xpath('//*[@id="root"]/div/div/div[4]/div/select/option[1]'))
      ));
      await click_status_return.click();

    });

    it('Landlord Sign Out', async function () {

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