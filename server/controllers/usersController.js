const User = require("../model/userModel");
const brcrypt = require("bcrypt");

// Backend para registro
// req -> http request, lo que se pide
// res -> http response, la respuesta
// next -> argumento callback
// req.body -> lo obtenemos del body al mandarse en POST
// req.params -> lo obtenemos de la ruta url, sería como un GET. Se manda con el prefijo :id en las routas (ver userRoutes)
// req.query -> se usa para buscar, filtrar, ordenar, paginaci´n.. Viene en la url como key=value "http://localhost:3000/animals?page=10"
module.exports.register = async (req, res, next) => {
  try{
    const { username, email, password, nombre, apellidos, direccion, telefono } = req.body;

    const usernameCheck = await User.findOne({ username });
    if(usernameCheck){
      return res.json({msg: "El usuario ya está en uso", status: false});
    }

    const emailCheck = await User.findOne({ email });
    if(emailCheck){
      return res.json({msg: "El email ya está en uso", status: false});
    }

    const hashedPassword = await brcrypt.hash(password, 10);
    
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      nombre,
      apellidos,
      direccion,
      telefono
    }); 
    delete user.password;

    return res.json({status: true, user});
  } catch (ex){
      next(ex);
  }
};

module.exports.login = async (req, res, next) => {
  try{
    const { username, password} = req.body;

    const user = await User.findOne({ username });
    if(!user){
      return res.json({msg: "El usuario o contraseña son incorrectos", status: false});
    }
    
    const isPasswordValid = await brcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.json({msg: "El usuario o contraseña son incorrectos", status: false});
    }

    delete user.password;
    return res.json({status: true, user});
  } catch (ex){
      next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try{
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });
    return res.json({
      isSet:userData.isAvatarImageSet, 
      image: userData.avatarImage,
    });
  }catch(ex){
    next(ex);
  }
};

module.exports.getUser = async (req, res, next) => {
  try{
    const user = await User.find({_id: req.params.id}).select([
      "email",
      "username",
      "nombre",
      "apellidos",
      "direccion",
      "telefono",
      "avatarImage",      
    ]);
    return res.json(user);
  }catch(ex){
    next(ex);
  }
};

module.exports.getUserByEmail = async (req, res, next) => {
  try{
    const email = req.body.email.email;
    const user = await User.findOne({ email });    
    if(!user){
      return res.json({msg: "Email de usuario no encontrado", status: false});
    }
    return res.json(user);
  }catch(ex){
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try{
    const users = await User.find({_id:{ $ne: req.params.id }}).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  }catch(ex){
    next(ex);
  }
};

module.exports.userEdit = async (req, res, next) => {
  try{
    console.log(req.body);
    console.log("En user Edit de server");
    const userId = req.body.id;
    let userData = {};

    if(req.body.password !== ""){
      const hashedPassword = await brcrypt.hash(req.body.password, 10);

      userData = await User.findByIdAndUpdate(userId, {
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        email: req.body.email,
        password: hashedPassword,
      });
    } else {      
      userData = await User.findByIdAndUpdate(userId, {
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        email: req.body.email,
      });
    }
    
    return res.json({user: userData, status: true,});
  }catch(ex){
    next(ex);
  }
};