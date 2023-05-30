const express = require("express"); // Biblioteca para el enrutamiento y solicitudes http
const cors = require("cors"); // Bibloteca de seguridad para peticiones http
const mongoose = require("mongoose"); //Bibloteca mongoose para interactuar con MongoDB
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");
const communityRoute = require("./routes/communityRoute");
const app = express();
const socket = require("socket.io");

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);
app.use("/api/communities", communityRoute);


//Usamos mongoose y el archivo env para conectar con la BD
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => { // Si se ha conectado con exito que salga mensaje
  console.log("Conexión con DB exitosa");
}).catch((err) =>{
  console.log(err.message);
});
// Que conecte con el puerto establecido para la conexión
const server = app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});

const io = socket(server, {
  cors:{
    origin:"http://localhost:3000",
    credentials: true,
  }
});

global.onlineUsers = new Map();
let chatRoom = '';
let allUsers = []; 
// Cuando haya una conexion que meta el global.chatsocket en socket
// Cuando este la conexion y luego un usuario haga login metera el userId y el socketId establecido en el mapa
io.on("connection", (socket) => {  
  
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id); 
       
  });

  // Cuando vaya a mandar un mensaje que compruebe en el mapa si ese user esta online
  // si devuelve verdadero porque esta online en el mapa entonces mandara el mensaje
  socket.on("send-msg", (data) => {    
      const sendUserSocket = onlineUsers.get(data.to);      
      io.to(sendUserSocket).emit("msg-recieve", data.message);      
    }
  );

  socket.on("join_room", (data) => {
    const username = data.currentUser.username;
    const room = data.currentChat.name;    
    socket.join(room);
        
    socket.to(room).emit('receive_message', {
      message: `${username} se ha unido al chat`,
      user: "ChatBot",  
    });

    chatRoom = room;
    allUsers.push({ id: socket.id, username, room });
    chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit('chatroom_users', chatRoomUsers);
    socket.emit('chatroom_users', chatRoomUsers);    
  });

  socket.on('send-msg-group', (data) => {    
    const room = data.chat; 
    io.to(room).emit('receive_message', data); // Send to all users in room, including sender
  });  
});