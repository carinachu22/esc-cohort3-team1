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
            if (err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(1);
            done();
        })
    });
    test ("Test calling getTenantByEmail() on an invalid email",(done) => {
        getTenantByEmail('wrong@gmail.com', (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(0);
            done();
        })
    });
})

describe("Testing getTenantById() in tenant model", () => {
    test ("Test calling getTenantById() on a valid tenant ID",(done) => {
        getTenantById(1, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(1);
            done();
        })
    });
    test ("Test calling getTenantById() on an invalid tenant ID",(done) => {
        getTenantById(999, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(0);
            done();
        })
    });
})

describe("Testing updateTenantPassword() in tenant model", () => {
    test ("Test calling updateTenantPassword() on valid tenant ID",(done) => {
        const data = {
            password: "$2b$10$BIJTkvtOrkrKhl/juVKCBuVhPwqChMNbayD3DazrMBi6H6gsgVlrS",
            id: 1
        }
        updateTenantPassword(data, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });
    test ("Test calling updateTenantPassword() on an invalid tenant ID",(done) => {
        const data = {
            password: "$2b$10$BIJTkvtOrkrKhl/juVKCBuVhPwqChMNbayD3DazrMBi6H6gsgVlrS",
            id: 999
        }
        updateTenantPassword(data, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(0);
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
            const rowsChanged = JSON.parse(JSON.stringify(results)).affectedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });
})

describe("Testing quotationApproval() in tenant model", () => {
    test ("Test calling quotationApproval() on a valid service ticket ID & valid value",(done) => {
        quotationApproval("2004-04-04 04:04:04", 'ticket_quotation_approved', (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });
    test ("Test calling quotationApproval() on an invalid service ticket ID & valid value",(done) => {
        quotationApproval("9999-99-99 99:99:99", 'ticket_quotation_rejected', (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(0);
            done();
        })
    });
    test ("Test calling quotationApproval() on status not approved in status library",(done) => {
        quotationApproval("2005-05-05 05:05:05", 'ticket_quotation_reject', (err, results) => {
            expect(err).toBe("invalid status");
            done()
        })
    });

})

describe("Testing addFeedbackRating() in tenant model", () => {
    test ("Test calling addFeedBackRating() on a valid service ticket ID & valid value",(done) => {
        addFeedbackRating("2002-02-02 02:02:02", 4, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });
    test ("Test calling addFeedBackRating() on an invalid service ticket ID & valid value",(done) => {
        addFeedbackRating("9999-99-99 99:99:99", 4, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(0);
            done();
        })
    });
    test ("Test calling addFeedBackRating() on a valid service ticket ID & invalid value",(done) => {
        addFeedbackRating("2003-03-03 03:03:03", 6, (err, results) => {
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
        addFeedbackRating("0000-00-00 00:00:00", 6, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(0);
            done();
        })
    });

})

describe("Testing addFeedbackText() in tenant model", () => {
    test ("Test calling addFeedbackText() on a valid service ticket ID",(done) => {
        addFeedbackText("2003-03-03 03:03:03", "good job", (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });
    test ("Test calling addFeedbackText() on an invalid service ticket ID",(done) => {
        addFeedbackText("0000-00-00 00:00:00", "good!", (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(0);
            done();
        })
    });
})

describe("Testing closeTicketStatus() in tenant model", () => {
    test ("Test calling closeTicketStatus() on a valid service ticket ID & valid value",(done) => {
        closeTicketStatus("2002-02-02 02:02:02", 'landlord_ticket_closed', (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });
    test ("Test calling closeTicketStatus() on an invalid service ticket ID & valid value",(done) => {
        closeTicketStatus("9999-99-99 99:99:99", 'landlord_ticket_closed', (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(0);
            done();
        })
    });
    test ("Test calling closeTicketStatus() on an valid service ticket ID & invalid value",(done) => {
        closeTicketStatus("2004-04-04 04:04:04", 'landlord__tickets_close', (err, results) => {
            expect(err).toBe('invalid status')
            done()
        })
    });
})

describe("Testing getTenantUserId() in tenant model", () => {
    test ("Test calling getTenantUserId() on a valid email",(done) => {
        getTenantUserId("tenant1@gmail.com", (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(1);
            done();
        })
    });
    test ("Test calling getTenantUserId() on an invalid email",(done) => {
        getTenantUserId("tenant@gmail.com", (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(0);
            done();
        })
    });
})

describe("Testing getLeaseByTenant() in tenant model", () => {
    test ("Test calling getLeaseByTenant() on a valid tenant ID",(done) => {
        getLeaseByTenant(3, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(1);
            done();
        })
    });
    test ("Test calling getLeaseByTenant() on an invalid tenant ID",(done) => {
        getLeaseByTenant(999, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(0);
            done();
        })
    });
})

describe("Testing updateTenantLease() in tenant model", () => {
    test ("Test calling updateTenantLease() on valid tenant email",(done) => {
        var currentdate = new Date(); 
        const date = currentdate.getFullYear().toString() + '-' + (currentdate.getMonth() + 1).toString() + '-' + currentdate.getDate().toString() + ' ' + currentdate.getHours().toString() + ':' + ('0' + currentdate.getMinutes()).slice(-2) + ':' + currentdate.getSeconds().toString()
        updateTenantLease("tenant4@gmail.com",date, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });
    test ("Test calling updateTenantLease() on an invalid tenant email",(done) => {
        var currentdate = new Date(); 
        const date = currentdate.getFullYear().toString() + '-' + (currentdate.getMonth() + 1).toString() + '-' + currentdate.getDate().toString() + ' ' + currentdate.getHours().toString() + ':' + ('0' + currentdate.getMinutes()).slice(-2) + ':' + currentdate.getSeconds().toString()
        updateTenantLease("tenant@gmail.com", date, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(0);
            done();
        })
    });
})