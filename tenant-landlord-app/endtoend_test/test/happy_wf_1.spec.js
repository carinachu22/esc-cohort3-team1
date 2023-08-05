const {By, Builder, Browser, until} = require('selenium-webdriver');
const chai = require('chai');

const assert = chai.assert;

describe('Successful/Usual Service Ticket Workflow', function () {
    let tenant_driver;
    let landlord_driver

    before(async function () {
    tenant_driver = await new Builder().forBrowser('chrome').build();
    landlord_driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {await tenant_driver.quit(); await landlord_driver.quit()});


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


    it('Tenant Create Service Ticket', async function() {

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
        assert.equal('http://localhost:3000/pages/Dashboard', currentURL)
        });

    it('Select Landlord Option', async function () {
        await landlord_driver.get('http://localhost:3000/');
      
        let title = await landlord_driver.getTitle();
        assert.equal("React App", title);
      
        // In first page
        let landlordButton = await landlord_driver.wait(until.elementIsVisible(
            landlord_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/div/button[2]"))));
        await landlordButton.click();
      
         // In Landlord Login Page
         let loginText = await landlord_driver.wait(until.elementIsVisible(
             landlord_driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/form/div/h2'))));
         let result = await loginText.getText();
         assert.equal("Welcome landlord!", result);
          });
    
    it('Landlord login', async function () {
      
        // Sign in details: email, password, button
        let email_in = await landlord_driver.wait(until.elementIsVisible(
          landlord_driver.findElement(By.xpath('//*[@id="email"]'))));
        await email_in.sendKeys('landlord1@gmail.com');
    
        let pw_in = await landlord_driver.wait(until.elementIsVisible(
        landlord_driver.findElement(By.xpath('//*[@type="password"]'))));
        await pw_in.sendKeys('password');
      
        let submit_button = await landlord_driver.wait(until.elementIsVisible(
          landlord_driver.findElement(By.xpath('//*[@type="submit"]'))));
        await submit_button.click();
      
        await landlord_driver.manage().setTimeouts({implicit: 1000});
      
        // In Landlord Dashboard
        let next_pg = await landlord_driver.wait(until.elementIsVisible(
          landlord_driver.findElement(By.xpath('//*[@id="emailText"]'))));
        let result = await next_pg.getText();
        assert.equal("Welcome, landlord1@gmail.com", result);
        });

    it('Landlord View Service Tickets', async function () {
        // Click on "Service Ticket List"
        let ticket_list = await landlord_driver.wait(until.elementIsVisible(
        landlord_driver.findElement(By.xpath('//*[@id="root"]/div/div/div[1]/div[1]/div[3]/a'))
      ))
      await ticket_list.click();
  
      // Check if ticket portal is shown
      const currentURL = await landlord_driver.getCurrentUrl();
      assert.equal('http://localhost:3000/pages/TicketList', currentURL)
    });

    
    it('Landlord Approve Service Ticket', async function () {

        // const lastTicket = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]"))
        // await landlord_driver.executeScript("arguments[0].click();", lastTicket);

        // const detailsButton = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]//button[text()='View Details & Actions']"))
        // await landlord_driver.executeScript("arguments[0].click();", detailsButton);

        // let currentURL = await landlord_driver.getCurrentUrl();
        // assert.equal('http://localhost:3000/pages/ViewTicketPage/', currentURL)

        // await landlord_driver.sleep(2000)
        // const quotationCheckbox = landlord_driver.findElement(By.xpath("//*[@id='quotationCheckbox']"))
        // const approveButton = landlord_driver.findElement(By.xpath("//button[text()='Approve Ticket']"))

        // await landlord_driver.executeScript("arguments[0].click();", quotationCheckbox);
        // await landlord_driver.executeScript("arguments[0].click();", approveButton);

        // await landlord_driver.sleep(100)

        // currentURL = await landlord_driver.getCurrentUrl();
        // assert.equal('http://localhost:3000/pages/TicketList', currentURL)

        // await landlord_driver.sleep(300)



    // });

           
});

    
    




  

});
