const Community = require("../models/community");

exports.createCommunity = async (req, res) => {
  try {
    const { name } = req.body;
    const creator = req.user.id;

    const community = new Community({ name, creator, members: [creator] });
    await community.save();

    res.status(201).json(community);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.joinCommunity = async (req, res) => {
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
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCommunityMessages = async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId).populate("messages.user", "username");
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.status(200).json(community.messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.sendCommunityMessage = async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const { message } = req.body;

    community.messages.push({ user: req.user.id, message });
    await community.save();

    res.status(201).json(community.messages[community.messages.length - 1]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
