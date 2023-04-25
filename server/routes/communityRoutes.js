const router = require("express").Router();
const communityController = require("../controllers/communityController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rutas para comunidades
router.post("/registerCommunity", authMiddleware, communityController.createCommunity);
router.get("/allCommunities", authMiddleware, communityController.getAllCommunities);
router.get("/getCommunity/:id", authMiddleware, communityController.getCommunityById);
router.put("/updateCommunity/:id", authMiddleware, communityController.updateCommunity);
router.delete("/deleteCommunity/:id", authMiddleware, communityController.deleteCommunity);

module.exports = router;
