import {cleanup, pool} from '../../config/database.js';
import { addFeedbackRating, getTenantByEmail } from '../../models/tenant_model.js';


async function setup() {
    try {
        // TODO backup the existing data to a temp table?
        //        CREATE TEMPORARY TABLE test_service_request_backup 
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
            INSERT INTO tenant_user
            VALUES (1,'sam@gmail.com','asdf');
        `);
    
    } catch (error) {
        console.error("setup failed. " + error);
        throw error;
    }
}


async function teardown() {
    // TODO restore the table from the backup;
    
    try {
        await pool.promise().query(`
            TRUNCATE service_request;
            `);
            await pool.promise().query(`
            TRUNCATE tenant_user;
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

describe("Testing getTenantByEmail() in tenant model", () => {

    test ("Test calling getTenantByEmail() on a valid email",(done) => {
        getTenantByEmail('sam@gmail.com', (err, results) => {
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
    test ("Test calling getTenantByEmail() on an invalid email",(done) => {
        getTenantByEmail('wrong@gmail.com', (err, results) => {
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

describe("Testing addFeedbackRating() in tenant model", () => {
    test ("Test calling addFeedBackRating() on an invalid service ticket ID",(done) => {
        addFeedbackRating(2, 4, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            //console.log(JSON.parse(JSON.stringify(results)))
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            //console.log(rowsChanged)
            expect(rowsChanged).toBe(0);
            done();
        })
    });
    test ("Test calling addFeedBackRating() on a valid service ticket ID",(done) => {
        addFeedbackRating(1, 3, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            console.log(JSON.parse(JSON.stringify(results)))
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });
    test ("Test calling addFeedBackRating() on a valid service ticket ID with invalid value",(done) => {
        addFeedbackRating(1, 6, (err, results) => {
            if (err) {
                // Error is reported through the callback
                expect(err).toBeTruthy(); // Use any appropriate assertion to check the error
                done(); // Call done() to indicate that the test is complete
              } else {
                // No error occurred, you can add further assertions for success case here if needed
                done.fail(new Error("Expected error but got success")); // Fail the test since error was expected
              }
        })
    });

})