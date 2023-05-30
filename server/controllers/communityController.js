const Community = require("../model/communityModel");

module.exports.createCommunity = async (req, res, next) => {
  try {
    const { name, creator, members, messages } = req.body;
       
    const communityCheck = await Community.findOne({ name });

    if(communityCheck){
      return res.json({msg: "El nombre de comunidad ya existe", status: false});
    }

    
    const community = await Community.create({
      name,
      creator,
      members,
      messages,
    });

    return res.json({status: true, community});
  } catch (ex) {
    next(ex);
  }
};


module.exports.getAllMessage = async (req, res, next) => {
  try {

    const {from} = req.body;    
    const messages = await Community.find({
      _id: from, 
    });    

    const projectedMessages = messages[0].messages.map((msg) => {
      return {
        message: msg.message,
        user: msg.user,
        time: msg.createdAt,
      };
    });
    res.json(projectedMessages);
    
  } catch (ex) {
    next(ex);
  }
};


module.exports.sendCommunityMessage = async (req, res) => {
  try {     
    const community = await Community.findById(req.body.chat);
    if (!community) {
      return res.status(404).json({ message: "Comunidad no encontrada" });
    }
    console.log(req.body);
    const { user, message } = req.body;

    community.messages.push({ user: user, message: message });
    await community.save();

    res.status(201).json(community.messages[community.messages.length - 1]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno" });
  }
};

module.exports.getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    
    return res.json(communities);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


module.exports.deleteCommunity = async (req, res) => {
  try{
    const communityId = req.body.id.chat;
    
    const deleteCommunity = await Community.deleteOne({
      _id: communityId, 
    }); 

    return res.json(deleteCommunity);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

// ESTE POR AHORA NO SE UTILIZA
module.exports.joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (community.members.includes(req.user.id)) {
      return res.status(400).json({ message: "Already a member" });
    }

    community.members.push(req.user.id);
    await community.save();

    res.status(200).json(community);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
