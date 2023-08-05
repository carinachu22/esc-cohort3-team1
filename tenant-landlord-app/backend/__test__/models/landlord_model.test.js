import { 
    createLandlord,
    getLandlordByEmail, 
    getLandlordById,
    updateLandlordPassword,
    updateLandlord,
    deleteLandlord,
    deleteAllTenants,
    deleteTenantByEmail,
    createTenant,
    getTickets,
    getTicketById,
    getTicketsByStatus,
    updateQuotation,
    uploadQuotation,
    getQuotationPath,
    getQuotation,
    ticketApproval,
    ticketWork,
    getTenantAccounts,
    createLease,
    getLandlordUserId,
    getLeaseByLandlord,
    deleteLease,
    updateLease,
    uploadLease,
    getLeasePath
} from '../../models/landlord_model.js';
import setup from '../setup.js';
import teardown from '../teardown.js';

beforeAll(async () => {
    await setup();
});

afterAll(async () => {
    await teardown();
});


describe("Testing getLandlordByEmail() in landlord model", () => {

    test ("Test calling getLandlordByEmail() on a valid email",(done) => {
        getLandlordByEmail('landlord1@gmail.com', (err, results) => {
            // console.log(JSON.parse(JSON.stringify(results)))
            if (err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            // console.log(rowsLength)
            expect(rowsLength).toBe(1);
            done();
        })
    });
    test ("Test calling getLandlordByEmail() on an invalid email",(done) => {
        getLandlordByEmail('random@gmail.com', (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            // console.log(JSON.parse(JSON.stringify(results)))
            const rowsLength = results.length
            // console.log(rowsLength)
            expect(rowsLength).toBe(0);
            done();
        })
    });


})

describe ("Testing getTicketsByStatus() in landlord model", () => {

    test ("Test calling getTicketsByStatus() on a status not available", (done) => {
        getTicketsByStatus('landlord_started_work', (err, results) => {
            if(err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(0);
            done()
        })
    })

    test ("Test calling getTicketsByStatus() on a status available", (done) =>{
        getTicketsByStatus('tenant_ticket_created', (err, results) => {
            if(err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(2);
            done()
        })
    })

    test ("Test calling getTicketsByStatus() on a status not in status dictionary", (done) => {
        getTicketsByStatus('blablabla', (err, results) => {
            expect(err).toBe("invalid status");
            done()
        })
    })
})

describe("Testing getLandlordById() in landlord model", () => {
    test ("Test calling getLandlordById() on a valid landlord ID",(done) => {
        getLandlordById(1, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(1);
            done();
        })
    });
    test ("Test calling getLandlordById() on an invalid landlord ID",(done) => {
        getLandlordById(999, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(0);
            done();
        })
    });
})

describe("Testing updateLandlordPassword() in landlord model", () => {
    test ("Test calling updateLandlordPassword() on valid landlord ID",(done) => {
        const data = {
            password: "$2b$10$BIJTkvtOrkrKhl/juVKCBuVhPwqChMNbayD3DazrMBi6H6gsgVlrS",
            id: 1
        }
        updateLandlordPassword(data, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });
    test ("Test calling updateLandlordPassword() on an invalid landlord ID",(done) => {
        const data = {
            password: "$2b$10$BIJTkvtOrkrKhl/juVKCBuVhPwqChMNbayD3DazrMBi6H6gsgVlrS",
            id: 999
        }
        updateLandlordPassword(data, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(0);
            done();
        })
    });
})

describe("Testing getLandlordUserId() in landlord model", () => {
    test ("Test calling getLandlordUserId() on a valid email",(done) => {
        getLandlordUserId("landlord1@gmail.com", (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(1);
            done();
        })
    });
    test ("Test calling getLandlordUserId() on an invalid email",(done) => {
        getLandlordUserId("landlord@gmail.com", (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(0);
            done();
        })
    });
})

describe("testing createLandlord() in landlord model", () => {
    test ("Test calling createLandlord() with valid values",(done) => {
        const data = {
            email: 'landlord6@gmail.com',
            password: '$2b$10$BIJTkvtOrkrKhl/juVKCauVhPwqChMNbayD3DazrMBi6H6gsgVlrS',
            ticket_type: 'cleanliness'
        }
        createLandlord(data, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            console.log(`results ${results}`)
            const rowsChanged = JSON.parse(JSON.stringify(results)).affectedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });

    test ("Test calling createLandlord() with missing email",(done) => {
        const data = {
            password: '$2b$10$BIJTkvtOrkrKhl/juVKCauVhPwqChMNbayD3DazrMBi6H6gsgVlrS',
            ticket_type: 'cleanliness'
        }
        createLandlord(data, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    });

    test ("Test calling createLandlord() with missing password",(done) => {
        const data = {
            email: 'landlord6@gmail.com',
            ticket_type: 'cleanliness'
        }
        createLandlord(data, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    });

    test ("Test calling createLandlord() with missing ticket_type",(done) => {
        const data = {
            email: 'landlord6@gmail.com',
            password: '$2b$10$BIJTkvtOrkrKhl/juVKCauVhPwqChMNbayD3DazrMBi6H6gsgVlrS',
        }
        createLandlord(data, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    });

    test ("Test calling createLandlord() with duplicate email",(done) => {
        const data = {
            email: 'landlord1@gmail.com',
            password: '$2b$10$BIJTkvtOrkrKhl/juVKCauVhPwqChMNbayD3DazrMBi6H6gsgVlrS',
            ticket_type: 'horticuture'
        }
        createLandlord(data, (err, results) => {
            expect(err).toBe("landlord user already exists");
            done();
        })
    });
})

describe("Testing deleteAllTenants() in landlord model", () => {
    test("Test calling deleteAllTenants() with valid public building id", (done) => {
        deleteAllTenants(Date.now(), 'RC', (err,results) => {
            if (err){
                console.log("ERROR",err)
            }
            console.log(`results ${results}`)
            const rowsChanged = JSON.parse(JSON.stringify(results)).affectedRows
            expect(rowsChanged).toBe(2);
            done();
        })
    })

    test("Test calling deleteAllTenants() with invalid public building id", (done) => {
        deleteAllTenants(Date.now(), 'ABC', (err,results) => {
            if (err){
                console.log("ERROR",err)
            }
            console.log(`results ${results}`)
            const rowsChanged = JSON.parse(JSON.stringify(results)).affectedRows
            expect(rowsChanged).toBe(0);
            done();
        })
    })
})

describe("Testing deleteTenantByEmail() in landlord model", () => {
    test("Test calling deletetenantByEmail() with valid email", (done) => {
        deleteTenantByEmail(Date.now(), 'tenant1@gmail.com', (err,results) => {
            if (err){
                console.log("ERROR",err)
            }
            console.log(`results ${results}`)
            const rowsChanged = JSON.parse(JSON.stringify(results)).affectedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    })

    test("Test calling deleteTenantByEmail() with invalid email", (done) => {
        deleteTenantByEmail(Date.now(), 'random@gmail.com', (err,results) => {
            if (err){
                console.log("ERROR",err)
            }
            console.log(`results ${results}`)
            const rowsChanged = JSON.parse(JSON.stringify(results)).affectedRows
            expect(rowsChanged).toBe(0);
            done();
        })
    })
})

describe("testing createTenant() in landlord model", () => {
    test ("Test calling createTenant() with valid values",(done) => {
        const data = {
            email: 'tenant10@gmail.com',
            password: '$2b$10$BIJTkvtOrkrKhl/juVKCauVhPwqChMNbayD3DazrMBi6H6gsgVlrS',
            public_building_id: 'EPM'
        }
        createTenant(data.email, data.password, data.public_building_id, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            console.log(`results ${results}`)
            const rowsChanged = JSON.parse(JSON.stringify(results)).affectedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });

    test ("Test calling createTenant() with missing email",(done) => {
        const data = {
            password: '$2b$10$BIJTkvtOrkrKhl/juVKCauVhPwqChMNbayD3DazrMBi6H6gsgVlrS',
            public_building_id: "EPM"
        }
        createTenant(data.email, data.password, data.public_building_id, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    });

    test ("Test calling createTenant() with missing password",(done) => {
        const data = {
            email: 'tenant10@gmail.com',
            public_building_id: "EPM"
        }
        createTenant(data.email, data.password, data.public_building_id, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    });

    test ("Test calling createTenant() with missing public_building_id",(done) => {
        const data = {
            email: 'tenant10@gmail.com',
            password: '$2b$10$BIJTkvtOrkrKhl/juVKCauVhPwqChMNbayD3DazrMBi6H6gsgVlrS',
        }
        createTenant(data.email, data.password, data.public_building_id, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    });

    test ("Test calling createTenant() with duplicate email",(done) => {
        const data = {
            email: 'tenant1@gmail.com',
            password: '$2b$10$BIJTkvtOrkrKhl/juVKCauVhPwqChMNbayD3DazrMBi6H6gsgVlrS',
            public_building_id: "EPM"
        }
        createTenant(data.email, data.password, data.public_building_id, (err, results) => {
            expect(err).toBe("tenant user already exists");
            done();
        })
    });
})

describe("testing getTickets() in landlord model", () => {
    test ("Test calling getTickets()",(done) => {
        getTickets((err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            expect(results.length).toBe(5);
            done();
        })
    });
})

describe("Testing updateQuotation() in landlord model", () => {
    test ("Test calling updateQuotation() on valid public ticket ID",(done) => {
        updateQuotation("SR/2002/Feb/0001", (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });
    test ("Test calling updateQuotation() on an invalid public ticket ID",(done) => {
        updateQuotation("SR/9999/999/9999", (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(0);
            done();
        })
    });
})

describe("Testing uploadQuotation() in landlord model", () => {
    test ("Test calling uploadQuotation() on valid public ticket ID",(done) => {
        const data = {
            filepath: ":Content/Documents/quotation_details/q3",
            id: "SR/2002/Feb/0001"
        }
        uploadQuotation(data, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });

    test ("Test calling uploadQuotation() on an invalid public ticket ID",(done) => {
        const data = {
            filepath: ":Content/Documents/quotation_details/q3",
            id: "SR/9999/999/9999"
        }
        uploadQuotation(data, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(0);
            done();
        })
    });

    test ("Test calling uploadQuotation() on valid public ticket ID but missing path",(done) => {
        const data = {
            id: "SR/2002/Feb/0001"
        }
        uploadQuotation(data, (err, results) => {
            expect(err).toBe("missing data entry field!");
            done();
        })
    });
})

describe("Testing getQuotationPath() in landlord model", () => {
    test("Test calling getQuotationPath() with valid public ticket id", (done) => {
        getQuotationPath("SR/2002/Feb/0001", (err,results) => {
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

describe("Testing ticketApproval() in landlord model", () => {
    test ("Test calling ticketApproval() with valid inputs",(done) => {
        ticketApproval("SR/2002/Feb/0001", 1, "landlord_ticket_approved", (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });

    test ("Test calling ticketApproval() with invalid public ticket id",(done) => {
        ticketApproval("SR/9999/999/9999", 1, "landlord_ticket_approved", (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(0);
            done();
        })
    });

    test ("Test calling ticketApproval() with invalid status",(done) => {
        ticketApproval("SR/2002/Feb/0001", 1, "invalid_status", (err, results) => {
            expect(err).toBe("invalid status");
            done();
        })
    });

    test ("Test calling ticketApproval() with missing status",(done) => {
        ticketApproval("SR/2002/Feb/0001", 1, null, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    });

    test ("Test calling ticketApproval() with missing quotation_required",(done) => {
        ticketApproval("SR/2002/Feb/0001", null, "landlord_ticket_approved", (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    });

    test ("Test calling ticketApproval() with missing public ticket id",(done) => {
        ticketApproval("SR/2002/Feb/0001", 1, null, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    });
})

describe("Tesing ticketWork() in landlord model", () => {
    test("Test ticketWork() with valid inputs", (done) => {
        ticketWork("SR/2003/Mar/0001", "landlord_started_work", (err,results) => {
            if (err) {
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    })

    test("Test ticketWork() with invalid public ticket id", (done) => {
        ticketWork("SR/9999/999/9999", "landlord_started_work", (err,results) => {
            if (err) {
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(0);
            done();
        })
    })

    test("Test ticketWork() with invalid status", (done) => {
        ticketWork("SR/2003/Mar/0001", "invalid_status", (err,results) => {
            expect(err).toBe("invalid status");
            done();
        })
    })

    test("Test ticketWork() with missing status", (done) => {
        ticketWork("SR/2003/Mar/0001", null, (err,results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    })

    test("Test ticketWork() with missing public ticket id", (done) => {
        ticketWork(null, "landlord_started_work", (err,results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    })
})

describe("testing getTenantAccounts() in landlord model", () => {
    test ("Test calling getTenantAccounts() with valid building id that has tenants",(done) => {
        getTenantAccounts("TM1", (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            expect(results.length).toBe(3);
            done();
        })
    });

    test ("Test calling getTenantAccounts() with valid building id with one DELETED account",(done) => {
        getTenantAccounts("FC", (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            expect(results.length).toBe(1);
            done();
        })
    });

    test ("Test calling getTenantAccounts() with building with no tenant",(done) => {
        getTenantAccounts("CWP", (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            expect(results.length).toBe(0);
            done();
        })
    });

    test ("Test calling getTenantAccounts() with invalid public building id",(done) => {
        getTenantAccounts("CCP", (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            expect(results.length).toBe(0);
            done();
        })
    });
})

describe("testing createLease() in landlord model", () => {
    test("Test calling createLease() with valid inputs, no lease path", (done) => {
        const data = {
            floor: 10,
            unit_number: 100
        }
        createLease("2023-01-01 01:01:01", 5, 9, data, (err, results) => {
            if (err) {
                console.log("ERROR", err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).affectedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    })

    test("Test calling createLease() with valid inputs, with lease path", (done) => {
        const data = {
            floor: 10,
            unit_number: 100,
            pdf_path: ":Content/Documents/lease_details/9"
        }
        createLease("2023-01-01 01:01:01", 5, 9, data, (err, results) => {
            if (err) {
                console.log("ERROR", err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).affectedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    })

    test("Test calling createLease() with missing public lease id", (done) => {
        const data = {
            floor: 10,
            unit_number: 100
        }
        createLease(null, 5, 9, data, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    })

    test("Test calling createLease() with missing tenant id", (done) => {
        const data = {
            floor: 10,
            unit_number: 100
        }
        createLease("2023-01-01 01:01:01", 5, null, data, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    })

    test("Test calling createLease() with floor", (done) => {
        const data = {
            unit_number: 100
        }
        createLease("2023-01-01 01:01:01", 5, 9, data, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    })

    test("Test calling createLease() with missing unit number", (done) => {
        const data = {
            floor: 10,
        }
        createLease("2023-01-01 01:01:01", 5, 9, data, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    })

    test("Test calling createLease() with missing landlord id", (done) => {
        const data = {
            floor: 10,
            unit_number: 100
        }
        createLease("2023-01-01 01:01:01", null, 9, data, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    })
})

describe("testing uploadLease() in landlord model", () => {
    test("test calling uploadLease() with valid inputs", (done) => {
        const data = {
            filepath: ":Content/Documents/lease_details/9",
            publicLeaseID: "2016-01-20 18:16:15"
        }
        uploadLease(data, (err, results) => {
            if (err) {
                console.log("ERROR", err)
            }
            const changedRows = JSON.parse(JSON.stringify(results)).changedRows
            expect(changedRows).toBe(1)
            done()
        })
    })

    test("test calling uploadLease() with invalid public lease id", (done) => {
        const data = {
            filepath: ":Content/Documents/lease_details/9",
            publicLeaseID: "9999-99-99 99:99:99"
        }
        uploadLease(data, (err, results) => {
            if (err) {
                console.log("ERROR", err)
            }
            const changedRows = JSON.parse(JSON.stringify(results)).changedRows
            expect(changedRows).toBe(0)
            done()
        })
    })

    test("test calling uploadLease() with missing pdf path", (done) => {
        const data = {
            publicLeaseID: "2016-01-20 18:16:15"
        }
        uploadLease(data, (err, results) => {
            expect(err).toBe("missing data entry!")
            done()
        })
    })

    test("test calling uploadLease() with missing public lease id", (done) => {
        const data = {
            filepath: ":Content/Documents/lease_details/9",
        }
        uploadLease(data, (err, results) => {
            expect(err).toBe("missing data entry!")
            done()
        })
    })
})

describe("Testing updateLease() in landlord model", () => {
    test ("Test calling updateLease() on valid inputs without pdf of lease",(done) => {
        const data = {
            new_public_lease_id: Date.now(),
            floor: 10,
            unit_number: 678,
            pdf_path: null,
            old_public_lease_id : "2001-02-16 12:01:09"
        }
        updateLease(1, 2, data, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });

    test ("Test calling updateLease() on valid inputs with pdf of lease",(done) => {
        const data = {
            new_public_lease_id: Date.now(),
            floor: 11,
            unit_number: 778,
            pdf_path: "Content/Documents/lease_details/10",
            old_public_lease_id : "2002-03-24 23:01:10"
        }
        updateLease(2, 3, data, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
            expect(rowsChanged).toBe(1);
            done();
        })
    });

    test ("Test calling updateLease() on missing tenant id",(done) => {
        const data = {
            new_public_lease_id: Date.now(),
            floor: 10,
            unit_number: 678,
            pdf_path: ":Content/Documents/lease_details/10",
            old_public_lease_id : "2001-02-16 12:01:09"
        }
        updateLease(1, null, data, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    });

    test ("Test calling updateLease() on missing landlord id",(done) => {
        const data = {
            new_public_lease_id: Date.now(),
            floor: 10,
            unit_number: 678,
            pdf_path: ":Content/Documents/lease_details/10",
            old_public_lease_id : "2001-02-16 12:01:09"
        }
        updateLease(null, 2, data, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    });

    test ("Test calling updateLease() on missing floor",(done) => {
        const data = {
            new_public_lease_id: Date.now(),
            unit_number: 678,
            pdf_path: ":Content/Documents/lease_details/10",
            old_public_lease_id : "2001-02-16 12:01:09"
        }
        updateLease(1, 2, data, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    });

    test ("Test calling updateLease() on missing unit_number",(done) => {
        const data = {
            new_public_lease_id: Date.now(),
            floor: 10,
            pdf_path: ":Content/Documents/lease_details/10",
            old_public_lease_id : "2001-02-16 12:01:09"
        }
        updateLease(1, 2, data, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    });

    test ("Test calling updateLease() on missing new_public_lease_id",(done) => {
        const data = {
            unit_number: 678,
            floor: 10,
            pdf_path: ":Content/Documents/lease_details/10",
            old_public_lease_id : "2001-02-16 12:01:09"
        }
        updateLease(1, 2, data, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    });

    test ("Test calling updateLease() on missing old_public_lease_id",(done) => {
        const data = {
            new_public_lease_id: Date.now(),
            unit_number: 678,
            floor: 10,
            pdf_path: ":Content/Documents/lease_details/10",
        }
        updateLease(1, 2, data, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    });
})

describe("testing getLeasePath() in landlord model", () => {
    test ("Test calling getLeasePath() with valid tenant id",(done) => {
        getLeasePath(1, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            expect(results.length).toBe(1);
            done();
        })
    });

    test ("Test calling getLeasePath() with invalid tenant id",(done) => {
        getLeasePath(999, (err, results) => {
            if (err){
                console.log("ERROR",err)
            }
            expect(results.length).toBe(0);
            done();
        })
    });
})

describe("Testing deleteLease() in landlord model", () => {
    test("test calling deleteLease() with valid public lease id", (done) => {
        deleteLease("2007-11-20 11:11:11", (err, results) => {
            if (err) {
                console.log("ERROR", err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).affectedRows
            expect(rowsChanged).toBe(1)
            done()
        })
    })

    test("test calling deleteLease() with invalid public lease id", (done) => {
        deleteLease("9999-99-99 99:99:99", (err, results) => {
            if (err) {
                console.log("ERROR", err)
            }
            const rowsChanged = JSON.parse(JSON.stringify(results)).affectedRows
            expect(rowsChanged).toBe(0)
            done()
        })
    })
})

describe("testing getTicketsById() in landlord model", () => {
    test("test calling getTicketsById() with valid public ticket id", (done) => {
        getTicketById("SR/2002/Feb/0001", (err,results) => {
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

// //TODO: getLeaseByLandlord
// describe("Testing getLeaseByLandlord() in landlord model", () => {
//     test ("Test calling getLeaseByLandlord() on valid landlord id",(done) => {
//         getLeaseByLandlord(4, (err, results) => {
//             if (err){
//                 console.log("ERROR",err)
//             }
//             const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
//             expect(rowsChanged).toBe(1);
//             done();
//         })
//     });
//     test ("Test calling getLeaseByLandlord() on an invalid landlord id",(done) => {
//         getLeaseByLandlord(999, (err, results) => {
//             if (err){
//                 console.log("ERROR",err)
//             }
//             const rowsChanged = JSON.parse(JSON.stringify(results)).changedRows
//             expect(rowsChanged).toBe(0);
//             done();
//         })
//     });
// })


// TODO: updateLandlord

//TODO: deleteLandlord

//TODO: getQuotation

//TODO: getLeaseDetails

//TODO: deleteLease

//TODO: getLease

//TODO: getBuildings