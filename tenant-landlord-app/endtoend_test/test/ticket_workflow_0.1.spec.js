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
    landlord_driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {await tenant_driver.quit(); await landlord_driver.quit()});

    it('Select Tenant Option', async function () {
        await tenant_driver.get('http://localhost:3000/');

        let title = await tenant_driver.getTitle();
        assert.equal("React App", title);

        await tenant_driver.manage().setTimeouts({implicit: 300});

        // In first page
        await tenant_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/div/button[1]")).click();

        await tenant_driver.manage().setTimeouts({implicit: 500});

        // In Tenant Login Page
        let result = await tenant_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/form/div/h2")).getText();
        assert.equal("Welcome tenant!", result);
    });

    it('Tenant Login', async function () {
        // Go to landing page first
        // Reason is because we need to click the button to set user type
        await tenant_driver.get('http://localhost:3000/');

        let title = await tenant_driver.getTitle();
        assert.equal("React App", title);

        await tenant_driver.manage().setTimeouts({implicit: 300});

        // In first page
        await tenant_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/div/button[1]")).click();

        await tenant_driver.manage().setTimeouts({implicit: 300});

        await tenant_driver.findElement(By.xpath('//*[@id="email"]')).sendKeys('tenant1@gmail.com');
        await tenant_driver.findElement(By.xpath('//*[@id="password"]')).sendKeys('password');
        await tenant_driver.findElement(By.xpath('//*[@id="loginButton"]')).click();

        await tenant_driver.manage().setTimeouts({implicit: 800});
        // In Tenant Dashboard
        let result =  await tenant_driver.findElement(By.xpath("//*[@id='emailText']")).isDisplayed();
        assert.equal(true, result)
    });

    it('Select Landlord Option', async function () {
        // Go to landing page
        await landlord_driver.get('http://localhost:3000/');

        // Initial check
        let title = await landlord_driver.getTitle();
        assert.equal("React App", title);

        await landlord_driver.manage().setTimeouts({ implicit: 300 });

        // In first page
        await landlord_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/div/button[2]")).click();

        await landlord_driver.manage().setTimeouts({ implicit: 500 });

        // In Landlord Login Page
        let result = await landlord_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/form/div/h2")).getText();
        assert.equal("Welcome landlord!", result);
    });

    it('Landlord Login', async function () {
        // Go to landing page first
        // Reason is because we need to click the button to set user type
        await landlord_driver.get('http://localhost:3000/');

        let title = await landlord_driver.getTitle();
        assert.equal("React App", title);
    
        await landlord_driver.manage().setTimeouts({ implicit: 300 });
    
        // In first page
        await landlord_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/div/button[2]")).click();

        await landlord_driver.manage().setTimeouts({ implicit: 300 });

        await landlord_driver.findElement(By.xpath('//*[@id="email"]')).sendKeys('landlord1@gmail.com');
        await landlord_driver.findElement(By.xpath('//*[@id="password"]')).sendKeys('password');
        await landlord_driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/form/div/div[3]')).click();

        await landlord_driver.manage().setTimeouts({ implicit: 800 });

        // In Landlord Dashboard
        let result = await landlord_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/form/div/h2")).getText();
        assert.equal("Welcome landlord!", result);
    });
        
    it('Tenant View Service Tickets', async function () {
        await tenant_driver.get('http://localhost:3000/pages/TicketList/');

        let title = await tenant_driver.getTitle();
        assert.equal("React App", title);

        await tenant_driver.manage().setTimeouts({implicit: 300});
    
        const result = await tenant_driver.findElement(By.css('#ticketTable')).isDisplayed();
        assert.equal(true, result);
    
    });

    

   
});

