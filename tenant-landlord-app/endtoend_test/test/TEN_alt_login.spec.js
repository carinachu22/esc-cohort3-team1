// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const {By, Builder, Browser, until, Key} = require('selenium-webdriver');
const chai = require('chai');
import setup from "../setup.js"
import teardown from "../teardown.js";



// Use Chai assertion styles (e.g., "assert.equal")
const assert = chai.assert;
//TODO - change to explitcit when have time

describe('Unusual Login --Tenant', function () {
    let tenant_driver;

    before(async function () {
        await setup()
        tenant_driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () =>  {await tenant_driver.quit();await teardown()});
    
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

    
    it('Empty login input --> Password Required', async function () {
        await tenant_driver.get('http://localhost:3000/pages/LoginPage');

        let title = await tenant_driver.getTitle();
        assert.equal("React App", title);

        await tenant_driver.manage().setTimeouts({ implicit: 300 });

        await tenant_driver.findElement(By.xpath('//*[@id="email"]')).sendKeys('fake value');

        await tenant_driver.manage().setTimeouts({ implicit: 500 });

        // Required warning
        let result = await tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/form/div/div[2]/div[2]')).getText();
        assert.equal("Required", result);
    });


    it('Forget password page', async function() {
        await tenant_driver.get('http://localhost:3000/pages/LoginPage');

        let title = await tenant_driver.getTitle();
        assert.equal("React App", title);

        await tenant_driver.manage().setTimeouts({ implicit: 300 });
        // click forget password
        await tenant_driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/form/div/div[4]/a')).click();

        await tenant_driver.manage().setTimeouts({ implicit: 100 });

        let currentURL = await tenant_driver.getCurrentUrl();
        assert.equal('http://localhost:3000/pages/ForgotPasswordPage', currentURL)

    });

    // //TODO - if have time - try using mailhog
    // it('Forget password, fix (Only works for gmail)', async function() {
    //     await tenant_driver.get('http://localhost:3000/pages/ForgotPasswordPage');

    //     let title = await tenant_driver.getTitle();
    //     assert.equal("React App", title);

    //     await tenant_driver.manage().setTimeouts({ implicit: 300 });

        
    //     await tenant_driver.findElement(By.xpath('//*[@id="email"]')).sendKeys('testerscn5@gmail.com');
    //     await tenant_driver.findElement(By.xpath('//*[@id="sendButton"]')).click();

    //     
    //     await chrome_driver.get('https://www.google.com/gmail/about/');
    //     await chrome_driver.manage().setTimeouts({ implicit: 100 });
    //     await chrome_driver.findElement(By.xpath('/html/body/header/div/div/div/a[2]')).click();
        
    //     // Enter email, and press next
    //     await chrome_driver.findElement(By.xpath('//*[@id="identifierId"]')).sendKeys('testerscn5@gmail.com');
    //     await chrome_driver.findElement(By.xpath('//*[@id="identifierNext"]/div/button')).click();
    //     await chrome_driver.sleep(2000)
    //     await tenant_driver.manage().setTimeouts({ implicit: 500 });

    //     // Enter password and press next
    //     await chrome_driver.findElement(By.xpath('//*[@id="password"]/div[1]/div/div[1]/input')).sendKeys('TesterSCN!');
    //     await chrome_driver.findElement(By.xpath('//*[@id="passwordNext"]/div/button')).click();
    //     await tenant_driver.manage().setTimeouts({ implicit: 2000 });
    //     await chrome_driver.sleep(2000);

    //     // Check if gmail user is login
    //     currentURL = await chrome_driver.getCurrentUrl();
    //     assert.equal('https://mail.google.com/mail/u/0/#inbox', currentURL)
    // });




});