import React from "react";
import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";

const GroupUsersSelected = ({ user, handleFunction }) => {
  return (
    <Box
      as="button"
      borderRadius="lg"
      bg="tomato"
      color="white"
      px={4}
      h={8}
      margin={2}
      onClick={handleFunction}
    >
      {user.name}
      <CloseIcon py={0.5} margin={1} />
    </Box>
  );
};

export default GroupUsersSelected;
