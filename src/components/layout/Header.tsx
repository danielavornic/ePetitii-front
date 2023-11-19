import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  Text,
  Button,
  Container,
  Box,
  Flex,
  Grid,
  Input,
  IconButton,
  InputRightElement,
  InputGroup,
  Image,
  HStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FaPlus } from "react-icons/fa";
import { selectUser } from "@/store/selectors";
import { login, logout, subscribe } from "@/store/user";
import { LanguageSwitcher } from "@/components";

export const Header = () => {
  const t = useTranslations("header");

  const { query, push } = useRouter();
  const { search } = query;

  const { user } = useSelector(selectUser);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState(search || "");

  const handleSubmit = (term: string) => {
    push({
      pathname: "/petitions",
      query: { search: term },
    });
  };

  useEffect(() => {
    setSearchTerm(search || "");

    const userLocal = localStorage.getItem("user");
    const isSubscribed = localStorage.getItem("isSubscribed");
    if (userLocal) {
      dispatch(login(JSON.parse(userLocal)));
    }
    if (isSubscribed) {
      dispatch(subscribe());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box w="full" borderBottomWidth="1px">
      <Container maxW={{ sm: "6xl", "2xl": "8xl" }} px={0}>
        <Grid templateColumns="repeat(16, 1fr)" gap={4} w="full">
          <Box
            gridColumn="span 16"
            sx={{ display: "center" }}
            justifyContent="center"
            borderBottomWidth="1px"
            borderBottomLeftRadius="lg"
            borderRightWidth="1px"
            borderBottomRightRadius="lg"
            borderLeftWidth="1px"
            width="auto"
            padding="1.5"
          >
            <ChakraLink
              href="https://presedinte.md/"
              fontSize="sm"
              display="flex"
              alignItems="center"
            >
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Emblema_Guvernului_Republicii_Moldova.png"
                boxSize="20px"
                mr="0.5rem"
                alt={t("official_website")}
              />
              {t("official_website")}
            </ChakraLink>
            <Flex marginLeft="auto" alignItems="center" paddingRight="1rem">
              <LanguageSwitcher />
              <Box width="1px" height="20px" backgroundColor="gray.200" marginX="0.5rem" />
              <Button
                size="sm"
                as="a"
                href="#"
                variant="link"
                color="black"
                fontSize="sm"
                fontWeight="light"
              >
                {t("help")}
              </Button>
              <Box width="1px" height="20px" backgroundColor="gray.200" marginX="0.5rem" />
              {user !== null ? (
                <HStack spacing={2}>
                  <Link href="/profile">
                    <Text fontSize="sm" fontWeight="light" _hover={{ textDecoration: "underline" }}>
                      {user.name} {user.surname}
                    </Text>
                  </Link>
                  <Box width="1px" height="20px" backgroundColor="gray.200" marginX="0.5rem" />
                  <Button
                    size="sm"
                    variant="link"
                    color="black"
                    fontSize="sm"
                    fontWeight="light"
                    onClick={() => dispatch(logout())}
                  >
                    {t("user.logout")}
                  </Button>
                </HStack>
              ) : (
                <Link href="/mpass">
                  <Text fontSize="sm" fontWeight="light">
                    {t("authentication")}
                  </Text>
                </Link>
              )}
            </Flex>
          </Box>
        </Grid>

        <Flex
          alignItems="center"
          w="full"
          paddingTop="0.5rem"
          justifyContent="space-between"
          paddingBottom="0.5rem"
          px={0}
        >
          <Link href="/">
            <HStack role="group" spacing={4}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Coat_of_arms_of_Moldova.svg/640px-Coat_of_arms_of_Moldova.svg.png"
                alt="Site Logo"
                width="70px"
                height="70px"
              />
              <Box marginLeft="1rem" fontFamily="inherit" fontSize="18px" paddingTop="1rem">
                <Text fontSize="2xl" as="b">
                  {t("site_logo")}
                </Text>
                <Text fontSize="smaller">{t("official_representation")}</Text>
                <br />
              </Box>
            </HStack>
          </Link>

          <Flex alignItems="center" paddingRight="0rem">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(searchTerm as string);
              }}
            >
              <InputGroup size="lg" w="550px">
                <Input
                  placeholder={t("search_placeholder")}
                  rounded="full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <InputRightElement>
                  <IconButton
                    type="submit"
                    colorScheme="blue"
                    aria-label={t("search_placeholder")}
                    rounded="full"
                    icon={<SearchIcon />}
                  />
                </InputRightElement>
              </InputGroup>
            </form>
          </Flex>
          <Link href={user ? "/petitions/create" : "/mpass?createPetition"}>
            <Button
              width="auto"
              gap={4}
              marginX="auto"
              rounded="full"
              fontWeight="bold"
              colorScheme="blue"
              size="lg"
            >
              {t("create_petition")}
              <FaPlus />
            </Button>
          </Link>
        </Flex>
      </Container>
    </Box>
  );
};
