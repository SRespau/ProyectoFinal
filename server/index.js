const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
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


mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Conexión con DB exitosa");
}).catch((err) =>{
  console.log(err.message);
});

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

io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id); 
  });

  socket.on("send-msg", (data) => { 
      const sendUserSocket = onlineUsers.get(data.to);
      console.log(data);
      io.to(sendUserSocket).emit("msg-recieve", [data.message, data.time, data.from]);      
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
    io.to(room).emit('receive_message', data);
  });  
});