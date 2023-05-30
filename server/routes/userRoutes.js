const { register, login, setAvatar, getAllUsers, userEdit, getUser } = require("../controllers/usersController");

const router = require("express").Router();

router.post("/register", register); // Ruta registro por post
router.post("/login", login); // Ruta login por post
router.post("/setAvatar/:id",setAvatar); // Ruta para setAvatar por post
router.get("/allusers/:id", getAllUsers); // Ruta para obtener todos los usuarios
router.get("/getUser/:id", getUser);
router.post("/userEdit", userEdit);
module.exports = router;
