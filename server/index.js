const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); //Interactua con mongoDB
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");
const app = express();
const socket = require("socket.io");

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);


//Usamos el complemento para conectar con mongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => { //then es para hacer algo despues de que termine el bloque anterior
  console.log("DB Connection Successfull");
}).catch((err) =>{
  console.log(err.message);
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server Started on Port ${process.env.PORT}`);
});

const io = socket(server, {
  cors:{
    origin:"http://localhost:3000",
    credentials: true,
  }
});

global.onlineUsers = new Map();

// Cuando haya una conexion que meta el global.chatsocket en socket
// Cuando este la conexion y luego un usuario haga login metera el userId y el socketId establecido en el mapa
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // Cuando vaya a mandar un mensaje que compruebe en el mapa si ese user esta online
  // si devuelve verdadero porque esta online en el mapa entonces mandara el mensaje
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if(sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  })
});