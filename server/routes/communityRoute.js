const communityController = require("../controllers/communityController");

const router = require("express").Router();

router.post("/createCommunity", communityController.createCommunity);
router.get("/allCommunities", communityController.getAllCommunities);
router.post("/sendCommunityMsg", communityController.sendCommunityMessage);
router.post("/getCommunityMsg", communityController.getAllMessage);
router.post("/deleteCommunity", communityController.deleteCommunity);

module.exports = router;
