const {By, Builder, Browser, until} = require('selenium-webdriver');
const chai = require('chai');


// Use Chai assertion styles (e.g., "assert.equal")
const assert = chai.assert;

describe('Unusual Login --Landlord', function () {
    let landlord_driver;

    before(async function () {
        landlord_driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () =>  await landlord_driver.quit());
    
    it('Select Landlord Option', async function () {
        await landlord_driver.get('http://localhost:3000/');

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

    it('Wrong login input --> Invalid email', async function () {
        await landlord_driver.get('http://localhost:3000/pages/LoginPage');

        let title = await landlord_driver.getTitle();
        assert.equal("React App", title);

        await landlord_driver.manage().setTimeouts({ implicit: 300 });

        await landlord_driver.findElement(By.xpath('//*[@id="email"]')).sendKeys('fake value');
        await landlord_driver.findElement(By.xpath('//*[@id="password"]')).sendKeys('fake value');
        await landlord_driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/form/div/div[3]')).click();

        await landlord_driver.manage().setTimeouts({ implicit: 100 });

        // invalid input warning
        let result = await landlord_driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/form/div/div[1]/div')).getText();
        assert.equal("Invalid email", result);
    });

    it('Forget password', async function() {
        await landlord_driver.get('http://localhost:3000/pages/LoginPage');

        let title = await landlord_driver.getTitle();
        assert.equal("React App", title);

        await landlord_driver.manage().setTimeouts({ implicit: 300 });
        // click forget password
        await landlord_driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/form/div/div[4]/a')).click();

        await landlord_driver.manage().setTimeouts({ implicit: 100 });

        currentURL = await landlord_driver.getCurrentUrl();
        assert.equal('http://localhost:3000/pages/ForgotPasswordPage', currentURL)

    })




});


describe('Unusual Login --Tenant', function () {
    let tenant_driver;

    before(async function () {
        tenant_driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () =>  await tenant_driver.quit());
    
    it('Select Tenant Option', async function () {
        await tenant_driver.get('http://localhost:3000/');

        let title = await tenant_driver.getTitle();
        assert.equal("React App", title);

        await tenant_driver.manage().setTimeouts({ implicit: 300 });

        // In first page
        await tenant_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/div/button[1]")).click();

        await tenant_driver.manage().setTimeouts({ implicit: 500 });

        // In Tenant Login Page
        let result = await tenant_driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/form/div/h2")).getText();
        assert.equal("Welcome tenant!", result);
    });

    it('Wrong login input --> Invalid email', async function () {
        await tenant_driver.get('http://localhost:3000/pages/LoginPage');

        let title = await tenant_driver.getTitle();
        assert.equal("React App", title);

        await tenant_driver.manage().setTimeouts({ implicit: 300 });

        await tenant_driver.findElement(By.xpath('//*[@id="email"]')).sendKeys('fake value');
        await tenant_driver.findElement(By.xpath('//*[@id="password"]')).sendKeys('fake value');
        await tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/form/div/div[3]')).click();

        await tenant_driver.manage().setTimeouts({ implicit: 100 });

        // invalid input warning
        let result = await tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/form/div/div[1]/div')).getText();
        assert.equal("Invalid email", result);
    });

    it('Forget password page', async function() {
        await tenant_driver.get('http://localhost:3000/pages/LoginPage');

        let title = await tenant_driver.getTitle();
        assert.equal("React App", title);

        await tenant_driver.manage().setTimeouts({ implicit: 300 });
        // click forget password
        await tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/form/div/div[4]/a')).click();

        await tenant_driver.manage().setTimeouts({ implicit: 100 });

        currentURL = await tenant_driver.getCurrentUrl();
        assert.equal('http://localhost:3000/pages/ForgotPasswordPage', currentURL)

    })

    it('Forget password fix', async function() {
        await tenant_driver.get('http://localhost:3000/pages/ForgotPasswordPage');

        let title = await tenant_driver.getTitle();
        assert.equal("React App", title);

        await tenant_driver.manage().setTimeouts({ implicit: 300 });

        //TODO - sendkey for email in text holder
        //await tenant_driver.findElement(By.xpath('//*[@id="email"]')).sendkeys('testerscn5@gmail.com');
        await tenant_driver.findElement(By.xpath('//*[@id="sendButton"]')).click();


        // currentURL = await tenant_driver.getCurrentUrl();
        // assert.equal('http://localhost:3000/pages/ForgotPasswordPage', currentURL)

    })

    //TODO - DO 2FA -- login with email




});