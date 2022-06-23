import React from "react";
// import { Button } from "@chakra-ui/react";
import { Route } from "react-router-dom";
import Home from "./pages/Homepages";
import ChatPage from "./pages/ChatPage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Route path="/" component={Home} exact />
      <Route path="/chats" component={ChatPage} />

      {/* <Button>I just consumed some ⚡️Chakra!</Button> */}
    </div>
  );
}

export default App;
