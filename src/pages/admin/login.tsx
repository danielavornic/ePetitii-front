import React, { useState } from "react";
import {
  Input,
  Button,
  VStack,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Container,
  Flex,
} from "@chakra-ui/react";

import { useRouter } from "next/router";

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    return password.length >= 8 && hasUpperCase;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(""); // Clear email error on edit
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(""); // Clear password error on edit
  };

  const handleLogin = () => {
    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      isValid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError("8 characters and capital letter are required");
      isValid = false;
    }

    if (isValid) {
      router.push("/admin/dashboard");
    }
  };

  return (
    <>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Coat_of_arms_of_Moldova.svg/640px-Coat_of_arms_of_Moldova.svg.png"
        alt="Site Logo"
        width="100px"
        height="100px"
        className="absolute top-[100px] left-[50%] transform -translate-x-1/2"
      ></img>
      <Box className="flex h-screen justify-center items-center bg-white">
        <VStack spacing={4} bgColor="white" p={8} borderRadius="md" boxShadow="xl">
          <FormControl id="email" isInvalid={!!emailError}>
            <FormLabel>Email</FormLabel>
            <Input
              width={"400px"}
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
            />
            <FormErrorMessage fontSize={"12px"}>{emailError}</FormErrorMessage>
          </FormControl>

          <FormControl id="password" isInvalid={!!passwordError}>
            <FormLabel>Password</FormLabel>
            <Input
              width={"400px"}
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
            />
            <FormErrorMessage fontSize={"12px"}>{passwordError}</FormErrorMessage>
          </FormControl>

          <Button colorScheme="blue" width="full" onClick={handleLogin} mt={"20px"}>
            Login
          </Button>
        </VStack>
      </Box>
    </>
  );
};

export default Login;
