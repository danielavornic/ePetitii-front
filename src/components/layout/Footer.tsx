import {
  Stack,
  Text,
  Grid,
  useColorModeValue,
  Image,
  Link as ChakraLink,
  GridItem,
  Flex,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";

import Link from "next/link";

const getCurrentYear = () => new Date().getFullYear();

export const Footer = () => {
  const t = useTranslations("footer");
  const currentYear = getCurrentYear();

  return (
    <Grid
      borderTopWidth={1}
      borderStyle={"solid"}
      borderColor={useColorModeValue("gray.200", "gray.700")}
      h="125px"
      templateRows="3fr 2fr"
      templateColumns="2fr 3fr 2fr"
      gap={2}
      bottom={0}
      w="full"
    >
      <GridItem rowSpan={2} colSpan={1} bg="transparent" justifySelf="end" alignSelf="center">
        <Image
          src="https://gov.md/sites/default/files/banners/gov_logo_md.svg"
          boxSize="90px"
          alt="Republica Moldova"
        />
      </GridItem>
      <GridItem colSpan={1} bg="transparent" alignSelf="flex-end">
        <Stack alignItems="center">
          <Text fontSize="sm">
            © {currentYear} {t("copyright")}
          </Text>
          <Text fontSize="sm">
            {t("administration")}:{" "}
            <ChakraLink href="https://stisc.gov.md/">{t("service")}</ChakraLink>.
          </Text>
        </Stack>
      </GridItem>
      <GridItem colSpan={1} colStart={2} bg="transparent">
        <Flex justifyContent="center" gap="50px">
          <ChakraLink href={"https://gov.md/ro"} fontSize="sm">
            {t("links.government")}
          </ChakraLink>
          <ChakraLink href={"https://presedinte.md/"} fontSize="sm">
            {t("links.presidency")}
          </ChakraLink>
          <ChakraLink
            href="https://www.parlament.md/CadrulLegal/Constitution/tabid/151/language/ro-RO/Default.aspx"
            fontSize="sm"
          >
            {t("links.presidency")}
          </ChakraLink>
          <ChakraLink href="https://gov.md/ro/content/contacte" fontSize="sm">
            {t("links.contacts")}
          </ChakraLink>
          <Link href="/developers" style={{ fontSize: 14 }}>
            <Text _hover={{ textDecoration: "underline" }}>{t("links.developers")}</Text>
          </Link>
        </Flex>
      </GridItem>
      <GridItem rowSpan={2} colSpan={1} colStart={3} rowStart={1} bg="transparent" />
    </Grid>
  );
};
