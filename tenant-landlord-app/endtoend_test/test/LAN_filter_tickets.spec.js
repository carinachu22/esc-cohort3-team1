const { By, Builder, Browser, until } = require('selenium-webdriver');
const chai = require('chai');

// Use Chai assertion styles (e.g., "assert.equal")
const assert = chai.assert;

describe('Landlord filter ticket', function () {
    let driver;
    let tenant_driver;

    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        tenant_driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {await tenant_driver.quit(); await driver.quit()});

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
          tenant_driver.findElement(By.xpath(`//select[@name="requestType"]/option[2]`))
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

        const lastTicket = driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]"))
        await driver.executeScript("arguments[0].click();", lastTicket);
        const detailsButton = driver.findElement(By.xpath("//*[@id='accordion-panel-:riu:']/div/div[1]/text()[4]"))
        const last_text = await driver.executeScript("arguments[0].getText();", detailsButton);
        assert.equal('tenant1@gmail.com', last_text);

        //*[@id="accordion-panel-:riu:"]/div/div[1]/text()[4]
        // const lastTicket = await driver.wait(until.elementIsVisible(
        //     driver.findElement(By.xpath("//*[@id='accordion-button-:r3g:']/div/div[2]"))
        // ));
        // await driver.sleep(3000)
        // await driver.executeScript("window.scrollTo(0,document.body.scrollHeight);");
        //*[@id="accordion-button-:riu:"]
        // let requester = await driver.wait(until.elementIsVisible(
        //     driver.findElement(By.xpath('//*[@id="accordion-button-:riu:"]'))
        // ))
        // const last_text = await requester.getText();
        // assert.equal('tenant1@gmail.com', last_text);


        
        // await driver.sleep(2000)
        // const last_text = await lastTicket.getText();
        // assert.equal('tenant1@gmail.com', last_text);
        // await driver.sleep(3000)


        // const output_text = await filtered_output.getText();
        // assert(!output_text.includes("tenant4@gmail.com"));

    });




});