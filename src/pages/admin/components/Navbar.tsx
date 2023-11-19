import React from "react";
import { Flex, Box, Heading, Text, Button, Spacer, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";

type props = {
  navHeader: string;
};

const Navbar = ({ navHeader }: props) => {
  const router = useRouter();
  return (
    <Flex as="nav" p="10px" alignItems="center" mb="40px">
      <Heading as="h1">{navHeader}</Heading>
      <Spacer />
    </Flex>
  );
};

export default Navbar;
