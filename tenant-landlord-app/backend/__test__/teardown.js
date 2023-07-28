import {cleanup, pool} from '../config/database.js';

export default async function teardown() {
    try {
        await pool.promise().query(`TRUNCATE service_request;`);
        await pool.promise().query(`TRUNCATE tenant_user;`);
        await pool.promise().query(`TRUNCATE landlord_user;`);
        await pool.promise().query(`TRUNCATE admin_user;`);
        await pool.promise().query(`TRUNCATE building;`);
        await pool.promise().query(`TRUNCATE lease;`);
        cleanup();
    } catch (error) {
        console.error("teardown failed. " + error);
        throw error;
    }
}