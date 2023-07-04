const { 
    createUser,
    getUserByUserID,
    getUsers 
} = require("./user.controller");
const router = require("express").Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/", getUserByUserId);
//router.patch("/",updateUsers);

router.post("/login", login);

module.exports = router;