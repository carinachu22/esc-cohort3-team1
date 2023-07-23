import {cleanup, pool} from '../../config/database.js';
import { getLandlordByEmail } from '../../models/landlord_model.js';


async function setup() {
    try {

        await pool.promise().query(`
            SELECT * FROM service_request LIMIT 0;
        `);
        await pool.promise().query(`
            DELETE FROM service_request;`
        );
        await pool.promise().query(`
            INSERT INTO service_request (service_request_id, public_id, name, email, request_type, request_description, submitted_date_time, status, feedback_rating, feedback_text)
            VALUES ('1', '01-01-01 00:00:00', 'sam', 'sam@gmail.com', 'aircon', 'aircon warm', '2023-01-01 00:00:00', 'submitted', null, 'good');
        `);
        await pool.promise().query(`
            INSERT INTO landlord_user 
            VALUES ('1','firstlandlord@gmail.com','password');
        `);
    
    } catch (error) {
        console.error("setup failed. " + error);
        throw error;
    }
}


async function teardown() {
    try {
        await pool.promise().query(`
            TRUNCATE service_request;
            `);
            await pool.promise().query(`
            TRUNCATE landlord_user;
            `);
        cleanup();
    } catch (error) {
        console.error("teardown failed. " + error);
        throw error;
    }
}
beforeAll(async () => {
    await setup();
});

afterAll(async () => {
    await teardown();
});


describe("Testing getLandlordByEmail() in landlord model", () => {

    test ("Test calling getLandlordByEmail() on a valid email",(done) => {
        getLandlordByEmail('firstlandlord@gmail.com', (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            console.log(JSON.parse(JSON.stringify(results)))
            const rowsLength = results.length
            console.log(rowsLength)
            expect(rowsLength).toBe(1);
            console.log('done?')
            done();
        })
    });
    test ("Test calling getLandlordByEmail() on an invalid email",(done) => {
        getLandlordByEmail('random@gmail.com', (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            console.log(JSON.parse(JSON.stringify(results)))
            const rowsLength = results.length
            console.log(rowsLength)
            expect(rowsLength).toBe(0);
            done();
        })
    });


})