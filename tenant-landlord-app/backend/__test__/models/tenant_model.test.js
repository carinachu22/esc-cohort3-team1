import {cleanup, pool} from '../../config/database.js';
import { addFeedbackRating } from '../../models/tenant_model.js';


async function setup() {
    try {
        // TODO backup the existing data to a temp table?
        //        CREATE TEMPORARY TABLE test_service_request_backup 
        await pool.promise().query(`

        SELECT * FROM test_service_request LIMIT 0;
        `);
        await pool.promise().query(`
            DELETE FROM test_service_request;`
        );
        await pool.promise().query(`
            INSERT INTO test_service_request (service_request_id, public_id, name, email, request_type, request_description, submitted_date_time, quotation_amount, status, feedback_rating, feedback_text)
            VALUES ('1', '01-01-01 00:00:00', 'sam', 'sam@gmail.com', 'aircon', 'aircon warm', '2023-01-01 00:00:00', '123', 'submitted', null, 'good');
        `);

        //console.log("HELLO")
    
    } catch (error) {
        console.error("setup failed. " + error);
        throw error;
    }
    //console.log("HAS THIS ENDED?")
}


async function teardown() {
    // TODO restore the table from the backup;
    
    try {
        await pool.promise().query(`
            TRUNCATE test_service_request;
            `);
        // await pool.promise().query(`
        //     INSERT INTO test_service_request SELECT * FROM test_service_request;
        // `);
        
        // await pool.promise().query(` 
        //     DELETE FROM test_service_request;`
        // );
        cleanup();
    } catch (error) {
        console.error("teardown failed. " + error);
        throw error;
    }
}

describe("models.tenant_model.addFeedbackRating()", () => {
    beforeAll(async () => {
        await setup();
    });
    test ("testing tenant_model.addFeedbackRating()",(done) => {
        addFeedbackRating(1, 3, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            //console.log(JSON.parse(JSON.stringify(results)))
            const status = JSON.parse(JSON.stringify(results)).serverStatus
            //console.log(status)
            expect(status).toBe(2);
            //console.log('DONE?')
            done();
            //console.log('???')
        })
        

        // result_promise.then((result) => {
        //     expect(result).toEqual(expected);
        // })

        // const res = await request(app).patch('/api/tenant/addFeedbackRating/1');
        // const expected = [ new Message('3'), 
        //                    new Message('msg b', new Date('2009-01-02:00:00:00'))]
        // expect(res.statusCode).toEqual(200);
        // const json = JSON.parse(res.text);
        // const received = [];
        // for (let i in json) {
        //     received.push(new Message(json[i].msg, new Date(json[i].time)))
        // }
        // expect(received.sort()).toEqual(expected.sort());
    });
    afterAll(async () => {
        await teardown();
    });

})