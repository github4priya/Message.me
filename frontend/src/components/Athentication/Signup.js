import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

const Signup = () => {
  const toast = useToast();
  const history = useHistory();

  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShowHide = () => setShow(!show);

  const postDetails = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      console.log("Picture is not defined");
      toast({
        title: "Picture is not defined",
        description: "We've created your account for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
        status: "error",
      });
      setLoading(false);
      return;
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      console.log("pic is valid..");
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "Message.me");
      data.append("cloud_name", "priyagupta8000");
      fetch("https://api.cloudinary.com/v1_1/priyagupta8000/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
          console.log(pic);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      console.log("Please select an image");
      toast({
        title: "Please select an image",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "bottom",
        status: "warning",
      });
      setLoading(false);
      return;
    }
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Fill all the fields....",
        status: "warning",
        duration: 5000,
        isClosable: true,
        status: "warning",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Password is not matched",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    // console.log("password size check");
    // if (password.size() <= 8) {
    //   // console.log("password size check");
    //   toast({
    //     title: "Password should be more than 8 letters",
    //     status: "warning",
    //     duration: 5000,
    //     isClosable: true,
    //   });
    //   setLoading(false);
    //   return;
    // }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/users",
        { name, email, password, pic },
        config
      );
      toast({
        title: "Registration successful..",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      history.push("/chats");
      window.location.reload();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occured..",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleShowHide}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleShowHide}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic" isRequired>
        <FormLabel>Upload Profile Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          placeholder="Choose picture"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
