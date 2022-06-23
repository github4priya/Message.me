const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupName,
  addUserToGroup,
  removeUserFromGroup,
} = require("../controllers/chatControllers");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/createGroup").post(protect, createGroupChat);
router.route("/renameGroup").put(protect, renameGroupName);
router.route("/addNewUserToGroup").put(protect, addUserToGroup);
router.route("/removeUserFromGroup").put(protect, removeUserFromGroup);

module.exports = router;
