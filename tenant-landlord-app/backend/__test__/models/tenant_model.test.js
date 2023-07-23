import {cleanup, pool} from '../../config/database.js';
import { addFeedbackRating } from '../../models/tenant_model.js';


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
            INSERT INTO service_request (service_request_id, public_id, name, email, request_type, request_description, submitted_date_time, quotation_amount, status, feedback_rating, feedback_text)
            VALUES ('1', '01-01-01 00:00:00', 'sam', 'sam@gmail.com', 'aircon', 'aircon warm', '2023-01-01 00:00:00', '123', 'submitted', null, 'good');
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
        cleanup();
    } catch (error) {
        console.error("teardown failed. " + error);
        throw error;
    }
}

describe("Testing addFeedbackRating() in tenant model", () => {
    beforeAll(async () => {
        await setup();
    });
    test ("Test calling addFeedBackRating() on an invalid service ticket ID",(done) => {
        addFeedbackRating(2, 4, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            console.log(JSON.parse(JSON.stringify(results)))
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            console.log(rowsChanged)
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
    afterAll(async () => {
        await teardown();
    });

})