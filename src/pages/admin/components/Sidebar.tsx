import React from "react";
import { List, ListItem, ListIcon, Spacer, HStack, Box, Text, Button } from "@chakra-ui/react";
import Link from "next/link";
import { AtSignIcon, CalendarIcon, EditIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

const Sidebar = () => {
  const router = useRouter();
  return (
    <List color="white" fontSize="1.2em" spacing={4} maxH={"100vh"}>
      <Link href="/admin/dashboard">
        <ListItem>
          <ListIcon as={CalendarIcon} />
          Dashboard
        </ListItem>
      </Link>
      <ListItem>
        <ListIcon as={EditIcon} />
        Edit Category
      </ListItem>
      <ListItem className="fixed bottom-4">
        <HStack spacing="20px">
          <Box bg="gray.200" p="5px 10px">
            G
          </Box>
          <Text fontSize={"15px"}>guvern@gmail.com</Text>
        </HStack>
        <Button colorScheme={"green"} onClick={() => router.push("/admin/login")} className="mt-4">
          Logout
        </Button>
      </ListItem>
    </List>
  );
};

export default Sidebar;
