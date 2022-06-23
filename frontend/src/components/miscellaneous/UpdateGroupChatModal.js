import React, { useState } from "react";
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Text,
  Box,
  FormControl,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import UserBadgeItem from "./GroupUsersSelected";
import axios from "axios";
import UserListItem from "./UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newGroupName, setNewGroupName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();

  const toast = useToast();

  const handleRemove = async (userToBeRemoved) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToBeRemoved._id !== user._id
    ) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/removeUserFromGroup`,
        {
          chatId: selectedChat._id,
          userId: userToBeRemoved._id,
        },
        config
      );

      userToBeRemoved._id === user._id
        ? setSelectedChat()
        : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setNewGroupName("");
  };

  const handleRename = async () => {
    if (!newGroupName) {
      toast({
        title: "Enter a Group name",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "api/chat/renameGroup",
        { chatId: selectedChat._id, chatName: newGroupName },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error occured..",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setRenameLoading(false);
    }
    setNewGroupName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/users?search=${search}`, config);

      setSearchResult(data);
      //   console.log(searchResult);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error occured..",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddUser = async (userToBeAdded) => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admin can add users",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    } else if (selectedChat.users.find((u) => u._id === userToBeAdded._id)) {
      toast({
        title: "User already exists in this group",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = axios.put(
        "/api/chat/addNewUserToGroup",
        { chatId: selectedChat._id, userId: userToBeAdded._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occured",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  //   admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="New Group Chat Name"
                mb={3}
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
