const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("no user id provided");
    res.sendStatus(400);
    return;
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);

      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(201).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send("Please fill all fields..");
  }
  console.log(req.body.users);
  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res.status(400).send("atleast 2 users required dear..");
  }
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroupName = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  if (!chatId || !chatName) {
    return res.status(400).send("Enter the name");
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (updatedChat) {
    res.status(200).json(updatedChat);
  } else {
    res.status(404).send("chat not found");
  }
});

const addUserToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  if (!chatId || !userId) {
    return res.status(400).send("Enter the fields");
  }

  const UpdatedGroupchat = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true } //so that it return the updated result otherwise it will not update in database
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (UpdatedGroupchat) {
    res.status(200).json(UpdatedGroupchat);
  } else {
    res.status(404).send("chat not found");
  }
});

const removeUserFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  if (!chatId || !userId) {
    return res.status(400).send("Enter the fields");
  }

  const UpdatedGroupchat = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true } //so that it return the updated result otherwise it will not update in database
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (UpdatedGroupchat) {
    res.status(200).json(UpdatedGroupchat);
  } else {
    res.status(404).send("chat not found");
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupName,
  addUserToGroup,
  removeUserFromGroup,
};
