import {cleanup, pool} from '../../config/database.js';
import { addFeedbackRating, getTenantByEmail, getTicketsByTenant, getTicketsByStatus, createTicket } from '../../models/tenant_model.js';


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
            VALUES ('1', '01-01-01 00:00:00', 'sam', 'sam@gmail.com', 'aircon', 'aircon warm', '2023-01-01 00:00:00', 'tenant_ticket_created', null, 'good');
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
            //console.log(JSON.parse(JSON.stringify(results)))
            const rowsLength = results.length
            //console.log(rowsLength)
            expect(rowsLength).toBe(1);
            //console.log('done?')
            done();
        })
    });
    test ("Test calling getTenantByEmail() on an invalid email",(done) => {
        getTenantByEmail('wrong@gmail.com', (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            //console.log(JSON.parse(JSON.stringify(results)))
            const rowsLength = results.length
            //console.log(rowsLength)
            expect(rowsLength).toBe(0);
            done();
        })
    });
})

describe ("Testing getTicketsByTenant() in tenant model", () => {
    test ("Test calling getTicketsByTenant() on a valid email", (done) => {
        getTicketsByTenant('sam@gmail.com', (err, results) => {
            if(err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(1);
            done()
        })
    })

    test ("Test calling getTicketsByTenant() on an invalid email", (done) =>{
        getTicketsByTenant('sgdbsgn@gmail.com', (err, results) => {
            if(err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(0);
            done()
        })
    })
})

describe ("Testing getTicketsByStatus() in tenant model", () => {
    test ("Test calling getTicketsByTenant() on a valid email & valid status", (done) => {
        console.log('huh')
        getTicketsByStatus('sam@gmail.com', 'tenant_ticket_created', (err, results) => {
            if(err){
                console.log("ERROR",err)
            }
            console.log(results)
            const rowsLength = results.length
            expect(rowsLength).toBe(1);
            console.log('good?')
            done()
        })
    })

    test ("Test calling getTicketsByTenant() on a valid email & invalid status", (done) => {
        getTicketsByStatus('sam@gmail.com', 'blablabla', (err, results) => {
            if(err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(0);
            console.log('good2?')
            done()
        })
    })

    test ("Test calling getTicketsByTenant() on an invalid email & valid status", (done) =>{
        getTicketsByStatus('sgdbsgn@gmail.com', 'tenant_ticket_created', (err, results) => {
            if(err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(0);
            console.log('good3?')
            done()
        })
    })

    test ("Test calling getTicketsByTenant() on an invalid email & invalid status", (done) => {
        getTicketsByStatus('ewqewqeww@gmail.com', 'blablabla', (err, results) => {
            if(err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(0);
            done()
        })
    })
})

describe("Testing createTicket() in tenant model", () => {
    test ("Test calling createTicket() with valid values",(done) => {
        var currentdate = new Date(); 
        const data = {
            name: 'sam',
            email: 'sam@gmail.com',
            request_type: 'aircon',
            request_description: 'aircon warm',
            submitted_date_time: currentdate.getFullYear().toString() +
            '-' +
            (currentdate.getMonth() + 1).toString() +
            '-' +
            currentdate.getDate().toString() +
            ' ' +
            currentdate.getHours().toString() +
            ':' +
            ('0' + currentdate.getMinutes()).slice(-2) +
            ':' +
            currentdate.getSeconds().toString(),
            status: 'tenant_ticket_created',
            feedback_rating: -1,
            feedback_text: ''
        }
        createTicket(data, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            //console.log(JSON.parse(JSON.stringify(results)))
            const rowsChanged = JSON.parse(JSON.stringify(results)).affectedRows
            //console.log(rowsChanged)
            expect(rowsChanged).toBe(1);
            done();
        })
    });
})

describe("Testing addFeedbackRating() in tenant model", () => {
    test ("Test calling addFeedBackRating() on a valid service ticket ID & valid value",(done) => {
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
    test ("Test calling addFeedBackRating() on an invalid service ticket ID & valid value",(done) => {
        addFeedbackRating(10, 4, (err, results) => {
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
    test ("Test calling addFeedBackRating() on a valid service ticket ID & invalid value",(done) => {
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
    test ("Test calling addFeedBackRating() on an invalid service ticket ID & invalid value",(done) => {
        // INVALID ID SUPERSEDES INVALID VALUE!
        // YOU WILL GET LENGTH 0
        addFeedbackRating(99, 6, (err, results) => {
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

})

describe("Testing closeTicketStatus() in tenant model", () => {
    test ("Test calling closeTicketStatus() on a valid service ticket ID & valid value",(done) => {
        closeTicketStatus(1, 'landlord_ticket_closed', (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            //console.log(JSON.parse(JSON.stringify(results)))
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });
    test ("Test calling closeTicketStatus() on an invalid service ticket ID & valid value",(done) => {
        closeTicketStatus(10, 'landlord_ticket_closed', (err, results) => {
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

})