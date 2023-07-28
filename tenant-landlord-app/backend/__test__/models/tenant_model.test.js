import { 
    getTenantByEmail,
    getTenantById,
    updateTenantPassword,
    getTicketsByTenant, 
    getTicketsByStatus, 
    createTicket, 
    quotationApproval,
    addFeedbackRating, 
    addFeedbackText,
    closeTicketStatus, 
    getTenantUserId,
    getLeaseByTenant,
    updateTenantLease 
} from '../../models/tenant_model.js';
import setup from '../setup.js';
import teardown from '../teardown.js';

beforeAll(async () => {
    await setup();
});
afterAll(async () => {
    await teardown();
});

describe("Testing getTenantByEmail() in tenant model", () => {
    test ("Test calling getTenantByEmail() on a valid email",(done) => {
        getTenantByEmail('tenant1@gmail.com', (err, results) => {
            // console.log(JSON.parse(JSON.stringify(results)))
            if (err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            // console.log(rowsLength)
            expect(rowsLength).toBe(1);
            // console.log('done?')
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
    test ("Test calling getTicketsByTenant() on a valid email with no tickets", (done) => {
        getTicketsByTenant('tenant5@gmail.com', (err, results) => {
            if(err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(0);
            done()
        })
    })

    test ("Test calling getTicketsByTenant() on a valid email with tickets", (done) => {
        getTicketsByTenant('tenant3@gmail.com', (err, results) => {
            if(err){
                console.log("ERROR",err)
                done();
                return;
            }
            console.log(results)
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
    test ("Test calling getTicketsByStatus() on a valid email & valid status", (done) => {
        getTicketsByStatus('tenant1@gmail.com', 'landlord_completed_work', (err, results) => {
            if(err){
                console.log("ERROR",err)
            }
            // console.log(results)
            const rowsLength = results.length
            expect(rowsLength).toBe(1);
            done()
        })
    })

    test ("Test calling getTicketsByStatus() on a valid email & invalid status", (done) => {
        getTicketsByStatus('tenant1@gmail.com', 'landlord_quotation_sent', (err, results) => {
            if(err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(0);
            done()
        })
    })

    test ("Test calling getTicketsByStatus() on an email with no tickets & valid status", (done) =>{
        getTicketsByStatus('tenant2@gmail.com', 'landlord_completed_work', (err, results) => {
            if(err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(0);
            done()
        })
    })

    test ("Test calling getTicketsByStatus() on a status not in status dictionary", (done) => {
        getTicketsByStatus('tenant2@gmail.com', 'blablabla', (err, results) => {
            expect(err).toBe("invalid status");
            done()
        })
    })
})

describe("Testing createTicket() in tenant model", () => {
    test ("Test calling createTicket() with valid values",(done) => {
        var currentdate = new Date(); 
        const date = currentdate.getFullYear().toString() + '-' + (currentdate.getMonth() + 1).toString() + '-' + currentdate.getDate().toString() + ' ' + currentdate.getHours().toString() + ':' + ('0' + currentdate.getMinutes()).slice(-2) + ':' + currentdate.getSeconds().toString()
        const data = {
            public_service_request_id:date,
            name: 'tenant4',
            email: 'tenant4@gmail.com',
            request_type: 'aircon',
            request_description: 'aircon cold',
            submitted_date_time: date
        }
        createTicket(data, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            // console.log(JSON.parse(JSON.stringify(results)))
            const rowsChanged = JSON.parse(JSON.stringify(results)).affectedRows
            //console.log(rowsChanged)
            expect(rowsChanged).toBe(1);
            done();
        })
    });
})

describe("Testing addFeedbackRating() in tenant model", () => {
    test ("Test calling addFeedBackRating() on a valid service ticket ID & valid value",(done) => {
        addFeedbackRating(3, 4, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            // console.log(JSON.parse(JSON.stringify(results)))
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });
    test ("Test calling addFeedBackRating() on an invalid service ticket ID & valid value",(done) => {
        addFeedbackRating(999, 4, (err, results) => {
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
        addFeedbackRating(3, 6, (err, results) => {
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
        addFeedbackRating(999, 6, (err, results) => {
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
            // console.log(JSON.parse(JSON.stringify(results)))
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });
    test ("Test calling closeTicketStatus() on an invalid service ticket ID & valid value",(done) => {
        closeTicketStatus(999, 'landlord_ticket_closed', (err, results) => {
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
    test ("Test calling closeTicketStatus() on an valid service ticket ID & invalid value",(done) => {
        closeTicketStatus(2, 'landlord__tickets_close', (err, results) => {
            expect(err).toBe('invalid status')
            done()
        })
    });
})

describe("Testing quotationApproval() in tenant model", () => {
    test ("Test calling quotationApproval() on a valid service ticket ID & valid value",(done) => {
        quotationApproval(2, 'ticket_quotation_approved', (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            console.log(JSON.parse(JSON.stringify(results)))
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });
    test ("Test calling quotationApproval() on an invalid service ticket ID & valid value",(done) => {
        quotationApproval(999, 'ticket_quotation_rejected', (err, results) => {
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
    test ("Test calling quotationApproval() on status not approved in status library",(done) => {
        quotationApproval(99, 'ticket_quotation_reject', (err, results) => {
            expect(err).toBe("invalid status");
            done()
        })
    });

})