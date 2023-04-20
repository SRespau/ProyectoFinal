const User = require("../model/userModel");
const brcrypt = require("bcrypt"); //Encriptación password

// Backend para registro
// req -> http request, lo que se pide
// res -> http response, la respuesta
// next -> argumento callback
// req.body -> lo obtenemos del body al mandarse en POST
// req.params -> lo obtenemos de la ruta url, sería como un GET. Se manda con el prefijo :id en las routas (ver userRoutes)
// req.query -> se usa para buscar, filtrar, ordenar, paginaci´n.. Viene en la url como key=value "http://localhost:3000/animals?page=10"
module.exports.register = async (req, res, next) => {
  try{
    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username }); // Busca en la base de datos, si existe el usuario devuelve true y manda error
    if(usernameCheck){
      return res.json({msg: "El usuario ya está en uso", status: false});
    }

    const emailCheck = await User.findOne({ email }); // Lo mismo que email
    if(emailCheck){
      return res.json({msg: "El email ya está en uso", status: false});
    }

    const hashedPassword = await brcrypt.hash(password, 10); // 10 es el tipo de encriptación. Encripta la contraseña escrita
    
    // Si ha llegado aqui todo es correcto y usamos comando .create para crear el usuario nuevo en la bbss.
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    }); 
    delete user.password; // Borramos la contraseña establecida que no esta encriptada antes de enviar el aviso de que ha sido creado.

    return res.json({status: true, user}); // Devuelve respuesta json con un status en true y el usuario
  } catch (ex){
      next(ex);
  }
};

// Backend para login
module.exports.login = async (req, res, next) => {
  try{
    const { username, password} = req.body;

    const user = await User.findOne({ username }); // Logeo. Si username no encuentra en la bbdd devuelve falso
    if(!user){
      return res.json({msg: "El usuario o contraseña son incorrectos", status: false});
    }
    
    const isPasswordValid = await brcrypt.compare(password, user.password); //Compara el pass enviado en front con el pass del backend (bbdd)
    if(!isPasswordValid){
      return res.json({msg: "El usuario o contraseña son incorrectos", status: false});
    }

    delete user.password; // Borra password del objeto usuario si es valido antes de mandar mensaje json mostrando 
    return res.json({status: true, user});
  } catch (ex){
      next(ex);
  }
};

// Backend para setAvatar
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

// Backend para ver todos los contactos
module.exports.getAllUsers = async (req, res, next) => {
  try{
    // Seleccionara todos los usuarios pero sin incluir nuestro id de usuario. 
    // Node.js -> $ne: operador que devuelve todo donde el valor no sea igual al valor dado, en este caso nuestra id
    // Con select obtendremos los datos que queremos coger del query.
    // En mongoDB al ID lo llama _id
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
}