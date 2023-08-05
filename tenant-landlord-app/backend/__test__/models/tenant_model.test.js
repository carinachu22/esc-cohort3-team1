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
    updateTenantLease, 
    recoverTenantAccount,
    getTicketById,
    getQuotationPath
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
        getTicketsByTenant('tenant6@gmail.com', (err, results) => {
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
            email: 'tenant4@gmail.com',
            request_type: 'aircon',
            request_description: 'aircon cold',
            submitted_date_time: date,
            quotation_path: null
        }
        createTicket(data, 10, 30, (err, results) => {
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
        quotationApproval("SR/2004/Apr/0001", 'ticket_quotation_approved', (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });
    test ("Test calling quotationApproval() on an invalid service ticket ID & valid value",(done) => {
        quotationApproval("SR/9999/999/9999", 'ticket_quotation_rejected', (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(0);
            done();
        })
    });
    test ("Test calling quotationApproval() on status not approved in status library",(done) => {
        quotationApproval("SR/2004/Apr/0001", 'ticket_quotation_reject', (err, results) => {
            expect(err).toBe("invalid status");
            done()
        })
    });

})

describe("Testing addFeedbackRating() in tenant model", () => {
    test ("Test calling addFeedBackRating() on a valid service ticket ID & valid value",(done) => {
        addFeedbackRating("SR/2002/Feb/0001", 4, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });
    test ("Test calling addFeedBackRating() on an invalid service ticket ID & valid value",(done) => {
        addFeedbackRating("SR/9999/999/9999", 4, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(0);
            done();
        })
    });
    test ("Test calling addFeedBackRating() on a valid service ticket ID & invalid value",(done) => {
        addFeedbackRating("SR/2003/Mar/0001", 6, (err, results) => {
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
        addFeedbackRating("SR/9999/999/9999", 6, (err, results) => {
            expect(err).toBe("data validation error")
            done();
        })
    });

})

describe("Testing addFeedbackText() in tenant model", () => {
    test ("Test calling addFeedbackText() on a valid service ticket ID",(done) => {
        addFeedbackText("SR/2003/Mar/0001", "good job", (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });
    test ("Test calling addFeedbackText() on an invalid service ticket ID",(done) => {
        addFeedbackText("SR/9999/999/9999", "good!", (err, results) => {
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
        closeTicketStatus("SR/2002/Feb/0001", 'landlord_ticket_closed', (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });
    test ("Test calling closeTicketStatus() on an invalid service ticket ID & valid value",(done) => {
        closeTicketStatus("SR/9999/999/9999", 'landlord_ticket_closed', (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(0);
            done();
        })
    });
    test ("Test calling closeTicketStatus() on an valid service ticket ID & invalid value",(done) => {
        closeTicketStatus("SR/2004/Apr/0001", 'landlord__tickets_close', (err, results) => {
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
        updateTenantLease(date,4, (err, results) => {
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
        updateTenantLease(date,999, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(0);
            done();
        })
    });
})

describe("Testing recoverTenantAccount() in tenant model", () => {
    test ("Test calling recoverTenantAccount() on valid tenant id",(done) => {
        recoverTenantAccount(3, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });
    test ("Test calling recoverTenantAccount() on an invalid tenant id",(done) => {
       recoverTenantAccount(999, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(0);
            done();
        })
    });
})

describe("testing getTicketById() in tenant model", () => {
    test("test calling getTicketById() with valid public ticket id", (done) => {
        getTicketById("SR/2003/Mar/0001", (err,results) => {
            expect(results.length).toBe(1)
            done()
        })
    })

    test("test calling getTicketsById() with invalid public ticket id", (done) => {
        getTicketById("SR/9999/999/9999", (err,results) => {
            expect(results.length).toBe(0)
            done()
        })
    })
})

describe("Testing getQuotationPath() in tenant model", () => {
    test("Test calling getQuotationPath() with valid public ticket id", (done) => {
        getQuotationPath("SR/2003/Mar/0001", (err,results) => {
            if (err) {
                console.log("ERROR",err)
            }
            expect(results.length).toBe(1)
            done()
        })
    })

    test("Test calling getQuotationPath() with invalid public ticket id", (done) => {
        getQuotationPath("SR/9999/999/9999", (err,results) => {
            if (err) {
                console.log("ERROR",err)
            }
            expect(results.length).toBe(0)
            done()
        })
    })
})

// TODO: getLeaseByTenantEmail

// TODO: getQuotation