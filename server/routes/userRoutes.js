const { register, login, setAvatar, getAllUsers, userEdit, getUser } = require("../controllers/usersController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id",setAvatar);
router.get("/allusers/:id", getAllUsers);
router.get("/getUser/:id", getUser);
router.post("/userEdit", userEdit);
module.exports = router;
