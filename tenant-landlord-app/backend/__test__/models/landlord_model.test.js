import { getLandlordByEmail } from '../../models/landlord_model.js';
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