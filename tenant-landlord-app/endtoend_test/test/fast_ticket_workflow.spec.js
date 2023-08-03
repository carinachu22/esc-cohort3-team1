const {By, Builder, Browser, until} = require('selenium-webdriver');
const chai = require('chai');

// Use Chai assertion styles (e.g., "assert.equal")

// ASSUMING THE SERVICE REQUEST TABLE IS EMPTY
const assert = chai.assert;
describe('Successful/Usual Service Ticket Workflow', function () {
    let tenant_driver;
    let landlord_driver

    before(async function () {
    tenant_driver = await new Builder().forBrowser('chrome').build();
    //landlord_driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {await tenant_driver.quit(); //await landlord_driver.quit()
});

    it('Select Tenant Option', async function () {
        await tenant_driver.get('http://localhost:3000/');

        let title = await tenant_driver.getTitle();
        assert.equal("React App", title);

        // In first page
        let tenantOptionButton = await tenant_driver.wait(until.elementIsVisible(tenant_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/div/button[1]"))));
        await tenantOptionButton.click()

        // In Tenant Login Page
        let loginText = await tenant_driver.wait(until.elementIsVisible(tenant_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/form/div/h2"))));
        let result = await loginText.getText();
        assert.equal("Welcome tenant!", result);
    });

    it('Tenant Login', async function () {
        // Go to landing page first
        // Reason is because we need to click the button to set user type
        await tenant_driver.get('http://localhost:3000/');

        let title = await tenant_driver.getTitle();
        assert.equal("React App", title);

        // In first page
        let tenantOptionButton = await tenant_driver.wait(until.elementIsVisible(tenant_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/div/button[1]"))));
        await tenantOptionButton.click()

        let loginField = await tenant_driver.wait(until.elementIsVisible(tenant_driver.findElement(By.xpath('//*[@id="email"]'))));
        await loginField.sendKeys('tenant1@gmail.com')
        let passwordField = await tenant_driver.wait(until.elementIsVisible(tenant_driver.findElement(By.xpath('//*[@id="password"]'))));
        await passwordField.sendKeys('password')
        let loginButton = await tenant_driver.wait(until.elementIsVisible(tenant_driver.findElement(By.xpath('//*[@id="loginButton"]'))));
        await loginButton.click()
        await tenant_driver.manage().setTimeouts({ implicit: 3000 });
        // In Tenant Dashboard
        let dashboardText = await tenant_driver.wait(until.elementIsVisible(tenant_driver.findElement(By.xpath("//*[@id='emailText']"))));
        let result = await dashboardText.isDisplayed()
        assert.equal(true, result)
    }); 

    // it('Select Landlord Option', async function () {
    //     // Go to landing page
    //     await landlord_driver.get('http://localhost:3000/');

    //     // Initial check
    //     let title = await landlord_driver.getTitle();
    //     assert.equal("React App", title);

    //     await landlord_driver.manage().setTimeouts({ implicit: 300 });

    //     // In first page
    //     await landlord_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/div/button[2]")).click();

    //     await landlord_driver.manage().setTimeouts({ implicit: 500 });

    //     // In Landlord Login Page
    //     let result = await landlord_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/form/div/h2")).getText();
    //     assert.equal("Welcome landlord!", result);
    // });

    // it('Landlord Login', async function () {
    //     // Go to landing page first
    //     // Reason is because we need to click the button to set user type
    //     await landlord_driver.get('http://localhost:3000/');

    //     let title = await landlord_driver.getTitle();
    //     assert.equal("React App", title);
    
    //     await landlord_driver.manage().setTimeouts({ implicit: 300 });
    
    //     // In first page
    //     await landlord_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/div/button[2]")).click();

    //     await landlord_driver.manage().setTimeouts({ implicit: 300 });

    //     await landlord_driver.findElement(By.xpath('//*[@id="email"]')).sendKeys('landlord1@gmail.com');
    //     await landlord_driver.findElement(By.xpath('//*[@id="password"]')).sendKeys('password');
    //     await landlord_driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/form/div/div[3]')).click();

    //     await landlord_driver.manage().setTimeouts({ implicit: 800 });

    //     // In Landlord Dashboard
    //     let result = await landlord_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/form/div/h2")).getText();
    //     assert.equal("Welcome landlord!", result);
    // });
        
    // it('Tenant View Service Tickets', async function () {
    //     await tenant_driver.get('http://localhost:3000/pages/TicketList/');

    //     let title = await tenant_driver.getTitle();
    //     assert.equal("React App", title);

    //     await tenant_driver.manage().setTimeouts({implicit: 300});
    
    //     const result = await tenant_driver.findElement(By.css('#ticketTable')).isDisplayed();
    //     assert.equal(true, result);
    
    // });

    // it('Tenant Create Service Ticket', async function() {
    //     await tenant_driver.get('http://localhost:3000/pages/CreateTicketPage/');

    //     let title = await tenant_driver.getTitle();
    //     assert.equal("React App", title);

    //     await tenant_driver.manage().setTimeouts({implicit: 1000});

    //     // Find the dropdown element by its CSS selector
    //     const dropdownElement = await tenant_driver.findElement(By.css('select[name="requestType"]'));

    //     // Click on the dropdown element to open the options list
    //     await dropdownElement.click();

    //     // Find the desired option by its text and click on it
    //     const optionLocator = By.xpath(`//select[@name="requestType"]/option[text()="Aircon"]`);
    //     await tenant_driver.findElement(optionLocator).click();

    //     await tenant_driver.findElement(By.xpath('//*[@id="tenantComment"]')).sendKeys('Dummy Request Description');

    //     // Find the "Submit" button by its CSS selector
    //     const submitButton = await tenant_driver.findElement(By.xpath('//*[@name="submitButton"]'));

    //     // Click on the "Submit" button
    //     await submitButton.click();

    //     await tenant_driver.manage().setTimeouts({implicit: 1000});
    //     // Check that we get redirected to dashboard
    //     await tenant_driver.sleep(1000)
    //     const currentURL = await tenant_driver.getCurrentUrl();
    //     assert.equal('http://localhost:3000/pages/Dashboard', currentURL)


    // })

    // it('Tenant View Created Service Ticket', async function () {
    //     await tenant_driver.get('http://localhost:3000/pages/TicketList/');

    //     let title = await tenant_driver.getTitle();
    //     assert.equal("React App", title);

    //     await tenant_driver.manage().setTimeouts({implicit: 300});
    //     await tenant_driver.sleep(3000);
    
    //     // Can find element but not visible
    //     const result = await tenant_driver.findElement(By.xpath("//div[text()='Dummy Request Description']")).isDisplayed();
    //     assert.equal(false, result);
    
    // });

    // it('Landlord View Service Tickets', async function () {
    //     await landlord_driver.get('http://localhost:3000/pages/TicketList/');

    //     let title = await landlord_driver.getTitle();
    //     assert.equal("React App", title);
        
    //     await landlord_driver.manage().setTimeouts({implicit: 300});
    //     //TODO - tenant can view tickets
    //     const result = await landlord_driver.findElement(By.css('#ticketTable')).isDisplayed();
    //     assert.equal(true, result);
    // });

    // it('Landlord View Created Service Ticket', async function () {
    //     await landlord_driver.get('http://localhost:3000/pages/TicketList/');

    //     let title = await landlord_driver.getTitle();
    //     assert.equal("React App", title);

    //     await landlord_driver.manage().setTimeouts({implicit: 300});
    
    //     // Can find element but not visible
    //     const result = await landlord_driver.findElement(By.xpath("//div[text()='Dummy Request Description']")).isDisplayed();
    //     assert.equal(false, result);
    
    // });

    // it('Landlord Approve Service Ticket', async function () {
    //     await landlord_driver.get('http://localhost:3000/pages/TicketList/');

    //     let title = await landlord_driver.getTitle();
    //     assert.equal("React App", title);

    //     await landlord_driver.manage().setTimeouts({implicit: 300});
        
    //     const lastTicket = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]"))
    //     await landlord_driver.executeScript("arguments[0].click();", lastTicket);

    //     const detailsButton = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]//button[text()='View Details & Actions']"))
    //     await landlord_driver.executeScript("arguments[0].click();", detailsButton);

    //     let currentURL = await landlord_driver.getCurrentUrl();
    //     assert.equal('http://localhost:3000/pages/ViewTicketPage/', currentURL)

    //     await landlord_driver.sleep(2000)
    //     const quotationCheckbox = landlord_driver.findElement(By.xpath("//*[@id='quotationCheckbox']"))
    //     const approveButton = landlord_driver.findElement(By.xpath("//button[text()='Approve Ticket']"))

    //     await landlord_driver.executeScript("arguments[0].click();", quotationCheckbox);
    //     await landlord_driver.executeScript("arguments[0].click();", approveButton);

    //     await landlord_driver.sleep(100)

    //     currentURL = await landlord_driver.getCurrentUrl();
    //     assert.equal('http://localhost:3000/pages/TicketList', currentURL)

    //     await landlord_driver.sleep(300)



    // });

    // it('Landlord Upload Quotation', async function () {
    //     const lastTicket = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]"))
    //     await landlord_driver.executeScript("arguments[0].click();", lastTicket);
    //     const detailsButton = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]//button[text()='View Details & Actions']"))
    //     await landlord_driver.executeScript("arguments[0].click();", detailsButton);

    //     let title = await landlord_driver.getTitle();
    //     assert.equal("React App", title);

    //     await landlord_driver.sleep(3000)

    //     await landlord_driver.manage().setTimeouts({implicit: 300});

    //     const goToQuotationButton = landlord_driver.findElement(By.xpath("//button[text()='View/Add Quotation']"))
    //     await landlord_driver.executeScript("arguments[0].click();", goToQuotationButton);

    //     let currentURL = await landlord_driver.getCurrentUrl();
    //     assert.equal('http://localhost:3000/pages/QuotationUploadPage/', currentURL)

    //     const chooseFileButton = landlord_driver.findElement(By.xpath("//input[@id='files']"))
    //     await chooseFileButton.sendKeys('C:/public/uploads/test.pdf')

    //     const uploadButton = landlord_driver.findElement(By.xpath("//button[text()='Upload Quotation']"))
    //     await uploadButton.click()

    //     await landlord_driver.sleep(200)
    //     currentURL = await landlord_driver.getCurrentUrl();
    //     assert.equal('http://localhost:3000/pages/ViewTicketPage/', currentURL)
    
    // });

    // it('Tenant View & Approve Quotation', async function () {
    //     await tenant_driver.get('http://localhost:3000/pages/TicketList/');

    //     let title = await tenant_driver.getTitle();
    //     assert.equal("React App", title);

    //     await tenant_driver.manage().setTimeouts({implicit: 300});
        
    //     const lastTicket = tenant_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]"))
    //     await tenant_driver.executeScript("arguments[0].click();", lastTicket);
    //     const detailsButton = tenant_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]//button[text()='View Details & Actions']"))
    //     await tenant_driver.executeScript("arguments[0].click();", detailsButton);

    //     const goToQuotationButton = tenant_driver.findElement(By.xpath("//button[text()='View/Add Quotation']"))
    //     await tenant_driver.executeScript("arguments[0].click();", goToQuotationButton);

    //     let currentURL = await tenant_driver.getCurrentUrl();
    //     assert.equal('http://localhost:3000/pages/QuotationPage/', currentURL)

    //     const quotationCheckbox = tenant_driver.findElement(By.xpath("//*[@id='quotationCheckbox']"))
    //     await tenant_driver.executeScript("arguments[0].click();", quotationCheckbox);

    //     const approveButton = tenant_driver.findElement(By.xpath("//button[text()='Approve']"))
    //     await tenant_driver.executeScript("arguments[0].click();", approveButton);

    //     await tenant_driver.sleep(200)
    //     currentURL = await landlord_driver.getCurrentUrl();
    //     assert.equal('http://localhost:3000/pages/ViewTicketPage/', currentURL)
    // });

    // it('Landlord Start Work', async function () {
    //     await landlord_driver.get('http://localhost:3000/pages/TicketList/');

    //     let title = await tenant_driver.getTitle();
    //     assert.equal("React App", title);

    //     await tenant_driver.manage().setTimeouts({implicit: 300});
    
    //     const lastTicket = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]"))
    //     await landlord_driver.executeScript("arguments[0].click();", lastTicket);
    //     const detailsButton = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]//button[text()='View Details & Actions']"))
    //     await landlord_driver.executeScript("arguments[0].click();", detailsButton);

    //     const startWorkButton = landlord_driver.findElement(By.xpath("//button[text()='Start Work']"))
    //     await landlord_driver.executeScript("arguments[0].click();", startWorkButton);

    //     await landlord_driver.sleep(200)
    //     let currentURL = await landlord_driver.getCurrentUrl();
    //     assert.equal('http://localhost:3000/pages/TicketList', currentURL)
    // });

    // it('Landlord End Work', async function () {
    //     await landlord_driver.get('http://localhost:3000/pages/TicketList/');

    //     let title = await tenant_driver.getTitle();
    //     assert.equal("React App", title);

    //     await tenant_driver.manage().setTimeouts({implicit: 300});
    
    //     const lastTicket = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]"))
    //     await landlord_driver.executeScript("arguments[0].click();", lastTicket);
    //     const detailsButton = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]//button[text()='View Details & Actions']"))
    //     await landlord_driver.executeScript("arguments[0].click();", detailsButton);

    //     const startWorkButton = landlord_driver.findElement(By.xpath("//button[text()='End Work']"))
    //     await landlord_driver.executeScript("arguments[0].click();", startWorkButton);

    //     await landlord_driver.sleep(200)
    //     let currentURL = await landlord_driver.getCurrentUrl();
    //     assert.equal('http://localhost:3000/pages/TicketList', currentURL)
    
    // });

    // it('Tenant Give Feedback', async function () {
    //     await tenant_driver.get('http://localhost:3000/pages/TicketList/');

    //     let title = await tenant_driver.getTitle();
    //     assert.equal("React App", title);

    //     await tenant_driver.manage().setTimeouts({implicit: 300});
        
    //     const lastTicket = tenant_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]"))
    //     await tenant_driver.executeScript("arguments[0].click();", lastTicket);
    //     const detailsButton = tenant_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]//button[text()='View Details & Actions']"))
    //     await tenant_driver.executeScript("arguments[0].click();", detailsButton);

    //     const feedbackButton = tenant_driver.findElement(By.xpath("//button[text()='Close Ticket & Give Feedback']"))
    //     await tenant_driver.executeScript("arguments[0].click();", feedbackButton);

    //     await tenant_driver.sleep(200)
    //     let currentURL = await tenant_driver.getCurrentUrl();
    //     assert.equal('http://localhost:3000/pages/FeedbackForm/', currentURL)

    //     const feedbackText = tenant_driver.findElement(By.name('comment'))
    //     await feedbackText.sendKeys('Dummy Feedback Comment');

    //     const feedbackRating = tenant_driver.findElement(By.xpath("//*[@class='chakra-icon css-11w35xc']"))
    //     await feedbackRating.click();

    //     const submitButton = tenant_driver.findElement(By.xpath("//button[text()='Submit']"))
    //     await submitButton.click()

    //     await tenant_driver.sleep(200);

    //     currentURL = await tenant_driver.getCurrentUrl();
    //     assert.equal('http://localhost:3000/pages/dashboard', currentURL)
    
    // });

    // it('Landlord View Feedback', async function () {
    //     const lastTicket = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]"))
    //     await landlord_driver.executeScript("arguments[0].click();", lastTicket);
    //     const detailsButton = landlord_driver.findElement(By.xpath("//*[@class='chakra-accordion css-0']/div[last()]//button[text()='View Details & Actions']"))
    //     await landlord_driver.executeScript("arguments[0].click();", detailsButton);


    //     const result = await landlord_driver.findElement(By.xpath("//*[text()='Dummy Feedback Comment']")).isDisplayed()
    //     assert.equal(true, result)



    // });

});

