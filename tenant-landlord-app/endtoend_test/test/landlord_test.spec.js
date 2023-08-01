const { By, Builder, Browser, until } = require('selenium-webdriver');
const chai = require('chai');

// Use Chai assertion styles (e.g., "assert.equal")
const assert = chai.assert;

describe('Login', function () {
    let driver;

    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => await driver.quit());

    it('Select Landlord Option', async function () {
        await driver.get('http://localhost:3000/');

        let title = await driver.getTitle();
        assert.equal("React App", title);

        await driver.manage().setTimeouts({ implicit: 300 });

        // In first page
        await driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/div/button[1]")).click();

        await driver.manage().setTimeouts({ implicit: 500 });

        // In Landlord Login Page
        let result = await driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/form/div/h2")).isDisplayed();
        assert.equal(true, result);
    });

    it('Landlord login', async function () {
        await driver.get('http://localhost:3000/pages/LoginPage');

        let title = await driver.getTitle();
        assert.equal("React App", title);

        await driver.manage().setTimeouts({ implicit: 300 });

        await driver.findElement(By.xpath('//*[@id="email"]')).sendKeys('landlord1@gmail.com');
        await driver.findElement(By.xpath('//*[@id="password"]')).sendKeys('password');
        await driver.findElement(By.xpath('//*[@id="root"]/div/div/div/div/form/div/div[3]')).click();

        await driver.manage().setTimeouts({ implicit: 800 });

        // In Landlord Dashboard
        let result = await driver.findElement(By.xpath("//*[@id='root']/div/div/div/div/form/div/div[3]")).isDisplayed();
        assert.equal(true, result);
    });
});

describe('Viewing Service Tickets', function () {
    let driver;

    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => await driver.quit());
    it("View Drop Down Detailed Service Request", async function() {


    await driver.get('http://localhost:3000/pages/TicketList');

    let title = await driver.getTitle();
    assert.equal("React App", title);

        //TODO - fix Drop Down view of service tickets info

        // await driver.manage().setTimeouts({implicit: 500});

        
        // await driver.findElement(By.xpath('//*[@id="root"]/div/div/div[6]/div[1]/div')).click();

        // await driver.manage().setTimeouts({implicit: 500});

        // // View Dropdown Details
        // let result =  await driver.findElement(By.xpath("//*[@id='accordion-panel-:r0:']/div/div[1]")).isDisplayed();
        // assert.equal(true, result)
    })
});
