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
    updateLease
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
            email: 'landlord4@gmail.com',
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
            email: 'landlord4@gmail.com',
            ticket_type: 'cleanliness'
        }
        createLandlord(data, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    });

    test ("Test calling createLandlord() with missing ticket_type",(done) => {
        const data = {
            email: 'landlord4@gmail.com',
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
            public_building_id: 'CWP'
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
            public_building_id: "CWP"
        }
        createTenant(data.email, data.password, data.public_building_id, (err, results) => {
            expect(err).toBe("missing data entry!");
            done();
        })
    });

    test ("Test calling createTenant() with missing password",(done) => {
        const data = {
            email: 'tenant10@gmail.com',
            public_building_id: "CWP"
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
            public_building_id: "CWP"
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

//TODO: getTicketsById

//TODO: getQuotationPath

//TODO: getQuotation

//TODO: ticketApproval

//TODO: ticketWork

//TODO: getTenantAccounts

//TODO:createLease

//TODO: uploadLease

//TODO: getLeaseDetails

//TODO: deleteLease

//TODO: updateLease

//TODO: getLeasePath

//TODO: getLease

//TODO: getBuildings