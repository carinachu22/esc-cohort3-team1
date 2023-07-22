import { pool, cleanup } from '../../config/database.js';
import { addFeedbackRating } from '../../models/tenant_model.js';
import request from 'supertest';
import app from '../../app.js';


async function setup() {
    try {
        // TODO backup the existing data to a temp table?
        await pool.query(`
        CREATE TEMPORARY TABLE sys.service_request_backup 
        SELECT * FROM sys.service_request LIMIT 0;
        `);
        await pool.query(`
            DELETE FROM feedback_rating;`
        );
        await pool.query(`
            INSERT INTO  (feedback_rating) 
            VALUES ('1', '01-01-01 00:00:00', 'sam', 'sam@gmail.com', 'aircon', 'aircon warm', '2023-01-01 00:00:00', '3', 'submitted', null, 'good' ),
        `);
    } catch (error) {
        console.error("setup failed. " + error);
        throw error;
    }
}


async function teardown() {
    // TODO restore the table from the backup;
    
    try {
        await pool.query(`
            TRUNCATE sys.service_request
            INSERT INTO sys.service_request SELECT * FROM sys.service_request_backup;
        `);
        await pool.query(` 
            DELETE FROM feedback_rating;`
        );
        await cleanup();
    } catch (error) {
        console.error("teardown failed. " + error);
        throw error;
    }
}

describe("models.tenant_model.addFeedbackRating()", () => {
    beforeAll(async () => {
        await setup();
    });
    test ("testing tenant_model.addFeedbackRating()", () => {
        // const expected = [('1', '01-01-01 00:00:00', 'sam', 'sam@gmail.com', 'aircon', 'aircon warm', 2023-01-01 00:00:00', '3', 'submitted', null, 'good' )];
        const result_promise = addFeedbackRating(1, 3);
;
        const expected =  ['1','01-01-01 00:00:00', 'sam', 'sam@gmail.com', 'aircon', 'aircon warm', '2023-01-01 00:00:00', '3', 'submitted', '3', 'good' ];

        result_promise.then((result) => {
            expect(result).toEqual(expected);
        })

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