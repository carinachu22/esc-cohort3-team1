import {cleanup, pool} from '../config/database.js';

const hash_password = "$2b$10$BIJTkvtOrkrKhl/juVKCauVhPwqChMNbayD3DazrMBi6H6gsgVlrS"

export default async function setup() {
    try {
        //        CREATE TEMPORARY TABLE service_request table 
        await pool.promise().query(`
            SELECT * FROM service_request LIMIT 0;
        `);
        await pool.promise().query(`
            TRUNCATE service_request;`
        );
        await pool.promise().query(`
            INSERT INTO service_request (public_service_request_id, name, email, request_type, request_description, submitted_date_time, status, quotation_path)
            VALUES  ('2002-02-02 02:02:02', 'tenant1', 'tenant1@gmail.com', 'aircon', 'aircon warm', '2002-02-02 02:02:02', 'tenant_ticket_created', NULL),
                    ('2003-03-03 03:03:03', 'tenant4', 'tenant4@gmail.com', 'aircon', 'aircon', '2003-03-03 03:03:03', 'tenant_ticket_created', NULL),
                    ('2004-04-04 04:04:04', 'tenant1', 'tenant1@gmail.com', 'cleanliness', 'not clean', '2004-04-04 04:04:04', 'landlord_completed_work',':Content/Documents/quotation_details/q2'),
                    ('2005-05-05 05:05:05', 'tenant3', 'tenant3@gmail.com', 'horticulture', 'wiltered', '2005-05-05 05:05:05', 'landlord_quotation_sent', ':Content/Documents/quotation_details/q1'),
                    ('2006-06-06 06:06:06', 'tenant5', 'tenant5@gmail.com', 'cleanliness', 'not clean', '2006-06-06 06:06:06', 'landlord_completed_work',':Content/Documents/quotation_details/q3');
        `);

        //        CREATE TEMPORARY TABLE tenant_user table
        await pool.promise().query(`
            SELECT * FROM tenant_user LIMIT 0;
        `);
        await pool.promise().query(`
            TRUNCATE tenant_user;`
        );
        await pool.promise().query(`
            INSERT INTO tenant_user
            (email,password,public_building_id,public_lease_id)
            VALUES  ("tenant1@gmail.com","${hash_password}", "RC", NULL),
                    ("tenant2@gmail.com","${hash_password}", "FC", "2001-01-01 00:00:00"),
                    ("tenant3@gmail.com","${hash_password}", "CWP", "2001-02-16 12:01:09"),
                    ("tenant4@gmail.com","${hash_password}", "FC", "2002-03-24 23:01:10"),
                    ("tenant5@gmail.com","${hash_password}", "CWP", "2002-10-30 10:10:10"),
                    ("tenant6@gmail.com","${hash_password}", "RC", "2003-10-30 11:11:11");
        `);

        //        CREATE TEMPORARY TABLE landlord_user table
        await pool.promise().query(`
            SELECT * FROM landlord_user LIMIT 0;
        `);
        await pool.promise().query(`
            TRUNCATE landlord_user;`
        );
        await pool.promise().query(`
            INSERT INTO landlord_user
            (email,password,public_building_id,ticket_type)
            VALUES  ('landlord1@gmail.com',"${hash_password}", "RC", "cleanliness"),
                    ('landlord2@gmail.com',"${hash_password}", "FC", "horticulture"),
                    ('landlord3@gmail.com',"${hash_password}", "CWP", "aircon");
        `);

        //        CREATE TEMPORARY TABLE admin_user table
        await pool.promise().query(`
            SELECT * FROM admin_user LIMIT 0;
        `);
        await pool.promise().query(`
            TRUNCATE admin_user;`
        );
        await pool.promise().query(`
            INSERT INTO admin_user
            (email,password)
            VALUES  ('admin1@gmail.com',"${hash_password}"),
                    ('admin2@gmail.com',"${hash_password}"),
                    ('admin3@gmail.com',"${hash_password}");
        `);

        //        CREATE TEMPORARY TABLE building table
        await pool.promise().query(`
            SELECT * FROM building LIMIT 0;
        `);
        await pool.promise().query(`
            TRUNCATE building;`
        );
        await pool.promise().query(`
            INSERT INTO building
            (public_building_id,building_name,address,postal_code)
            VALUES  ('RC','Raffles City','252 North Bridge Rd',179103),
                    ('FC','Funan City','107 North Bridge Rd',179103),
                    ('CWP','Causeway Point','1 Woodlands Square',738099);
        `);

            //        CREATE TEMPORARY TABLE lease table
            await pool.promise().query(`
                SELECT * FROM lease LIMIT 0;
            `);
            await pool.promise().query(`
                TRUNCATE lease;`
            );
            await pool.promise().query(`
                INSERT INTO lease 
                VALUES  (1,'2001-01-01 00:00:00',1,1,'09','154',':Content/Documents/lease_details/1'),
                        (2,'2001-02-16 12:01:09',2,1,'02','894',':Content/Documents/lease_details/2'),
                        (3,'2002-03-24 23:01:10',3,2,'12','921',':Content/Documents/lease_details/3'),
                        (4,'2002-10-30 10:10:10',4,3,'10','30',':Content/Documents/lease_details/4'),
                        (5,'2007-11-20 11:11:11',5,3,'6','100',':Content/Documents/lease_details/5'),
                        (6,'2004-01-20 11:11:11',6,3,'1','50',':Content/Documents/lease_details/6');
    
            `);
        
    
    } catch (error) {
        console.error("setup failed. " + error);
        throw error;
    }
}