// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const {By, Builder, Browser, until, Key} = require('selenium-webdriver');
const chai = require('chai');
import setup from "../setup.js"
import teardown from "../teardown.js";


const assert = chai.assert;
// TODO - change to explitcit when have time

describe('Unusual Login --Landlord', function () {
    let landlord_driver;

    before(async function () {
        await setup()
        landlord_driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () =>  {await landlord_driver.quit();await teardown()});
    
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

    it('Empty login input --> Password Required', async function () {
        await landlord_driver.get('http://localhost:3000/pages/LoginPage');

        let title = await landlord_driver.getTitle();
        assert.equal("React App", title);

        await landlord_driver.manage().setTimeouts({ implicit: 300 });

        await landlord_driver.findElement(By.xpath('//*[@id="email"]')).sendKeys('fake value');

        await landlord_driver.manage().setTimeouts({ implicit: 500 });

        // Required warning
        let result = await landlord_driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/form/div/div[2]/div[2]')).getText();
        assert.equal("Required", result);
    });

    it('Forget password', async function() {
        await landlord_driver.get('http://localhost:3000/pages/LoginPage');

        let title = await landlord_driver.getTitle();
        assert.equal("React App", title);

        await landlord_driver.manage().setTimeouts({ implicit: 300 });
        // click forget password
        await landlord_driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/form/div/div[4]/a')).click();

        await landlord_driver.manage().setTimeouts({ implicit: 100 });

        let currentURL = await landlord_driver.getCurrentUrl();
        assert.equal('http://localhost:3000/pages/ForgotPasswordPage', currentURL)

    })




});