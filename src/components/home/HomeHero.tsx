import { useTranslations } from "next-intl";
import { Stack, Flex, Text, VStack, useBreakpointValue, Heading } from "@chakra-ui/react";

export const HomeHero = () => {
  const t = useTranslations("home.hero");

  return (
    <Flex w="full" h="300px" bg="primary.600">
      <VStack w="full" justify="center" px={useBreakpointValue({ base: 4, md: 8 })}>
        <Stack w="full" maxW="8xl" align="flex-start" justifyContent="start" spacing={6}>
          <Text color="white" fontSize="xl">
            {t("description")}
          </Text>
          <Heading color="white" fontSize="6xl">
            {t("headline.part1")} <br />{" "}
            <span className="font-serif" style={{ fontWeight: 400 }}>
              {t("headline.part2")}
            </span>
          </Heading>
        </Stack>
      </VStack>
    </Flex>
  );
};
