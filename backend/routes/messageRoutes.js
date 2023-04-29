const express = require("express");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageControllers");
const { protect } = require("../middlewares/authMiddleware"); // for authorization - acts as a middleware

const router = express.Router();

//redirect to thier respective controllers
router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages); // takes a perticular chat id and show the messages

module.exports = router;
