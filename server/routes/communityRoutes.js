const express = require("express");
const router = express.Router();
const communityController = require("../controllers/communityController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rutas para comunidades
router.post("/", authMiddleware, communityController.createCommunity);
router.get("/", authMiddleware, communityController.getAllCommunities);
router.get("/:id", authMiddleware, communityController.getCommunityById);
router.put("/:id", authMiddleware, communityController.updateCommunity);
router.delete("/:id", authMiddleware, communityController.deleteCommunity);

module.exports = router;
