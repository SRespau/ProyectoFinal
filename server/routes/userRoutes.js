const { register, login, setAvatar, getAllUsers, userEdit, getUser, getUserByEmail } = require("../controllers/usersController");
const { sendEmail } = require("../utils/SendEmail");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id",setAvatar);
router.get("/allusers/:id", getAllUsers);
router.get("/getUser/:id", getUser);
router.post("/getUserByEmail", getUserByEmail);
router.post("/userEdit", userEdit);
router.post("/sendEmail", sendEmail);
module.exports = router;
