const pool = require("../../config/database");

module.exports = {
    create: (data, callBack) => {
        pool.query(
            `insert into registration(landlord_user_id, building_id, username, password, ticket_type)
                        values(?,?,?,?,?)`,
            [
                data.landlord_user_id,
                data.building_id,
                data.username,
                data.password,
                data.ticket_type
            ],
            (error,results, fields) => {
                if (error) {
                    callBack(error);
                    callBack(error);
                }
                return callBack(null, results)
            }

        )

    },

    getUsers: callBack => {
        pool.query(
            `select landlord_user_id, password `,

        )
    },

    getUserByUserId: (id, callBack) => {
        pool.query(
            `select landlord_user_id, password from registration where landlord_user_id = ?`,
            [landlord_user_id],
            (error, results, fields) = {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results)
            }
        );
    },

    //TODO: UPDATE & DELETE
    /* to do





    */


    login: (req,res) => {
        const body = req.body;
        this.getUserByUserId(body.landlord_user_id, (err, results) => {
            if (err) {
                console.log(err);
            }
            if(!results) {
                return res.json({
                    success: 0,
                    data: "Invalid ID or password"
                });
            }
            const result = compareSynce(body.password, results.password);
            if (result) {
                // undefined so we dont send the passwords through json
                results.password = undefined;
                // generate jsontoken
                // sign take =s 3 parameters, 1) object with results, 2) key, will be put in .env file, 3) expiure parameter
                const jsontoken =  sign({result: results }, "key is hardcoded for now", {
                    expiresIn: "1h"
                });
                return res.json({
                    success: 1, message: "login successfully",
                    token: jsontoken
                });
            }
            else {
                return res.json({
                    success:0,
                    data: "invalid email or password"
                });
            }
        })
    }
}