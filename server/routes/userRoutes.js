const { register, login, setAvatar, getAllUsers } = require("../controllers/usersController");

const router = require("express").Router();

router.post("/register", register); // Ruta registro por post
router.post("/login", login); // Ruta login por post
router.post("/setAvatar/:id",setAvatar); // Ruta para setAvatar por post
router.get("/allusers/:id", getAllUsers); // Ruta para obtener todos los usuarios

module.exports = router;
