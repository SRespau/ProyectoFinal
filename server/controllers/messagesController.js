const messageModel = require("../model/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const {from, to, message} = req.body;
    const data = await messageModel.create({
      message: {text: message },
      users: [from, to],
      sender: from,      
    });
    if(data) {
      return res.json({msg: "Mensaje añadido con exito."})
    }
    return res.json({msg: "Fallo en el envio del mensaje a la base de datos."});
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllMessage = async (req, res, next) => {
  try {
    const {from, to} = req.body;
    const messages = await messageModel.find({
      users: {
        $all: [from, to],
      }
    }).sort({ updatedAt: 1}); 
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        time: msg.createdAt,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};


