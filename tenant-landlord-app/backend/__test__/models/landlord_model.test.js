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
            console.log('done?')
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
    // test ("Test calling getTicketsByStatus() on a valid email & valid status", (done) => {
    //     getTicketsByStatus('tenant1@gmail.com', 'landlord_completed_work', (err, results) => {
    //         if(err){
    //             console.log("ERROR",err)
    //         }
    //         // console.log(results)
    //         const rowsLength = results.length
    //         expect(rowsLength).toBe(1);
    //         done()
    //     })
    // })

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
        getTicketsByStatus('landlord_completed_work', (err, results) => {
            if(err){
                console.log("ERROR",err)
            }
            const rowsLength = results.length
            expect(rowsLength).toBe(0);
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