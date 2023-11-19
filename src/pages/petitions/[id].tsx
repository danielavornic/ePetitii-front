import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Flex,
  HStack,
  Heading,
  Stack,
  VStack,
  Text,
  Tag,
  Box,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { petitions } from "@/api";
import { Layout, Loader, PetitionProgressCard } from "@/components";
import { FaFilePdf } from "react-icons/fa6";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/selectors";
import { useRouter } from "next/router";
import { Signer } from "@/types";
import { msignImage } from "@/constants";
import { useState } from "react";
import Share from "@/components/petition/Share";
import { useTranslations } from "next-intl";

const { convert } = require("html-to-text");

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Petition = () => {
  const t = useTranslations("petition");

  const { user } = useSelector(selectUser);
  const { query, locale } = useRouter();
  const id = query.id;

  const fullName = user?.name + " " + user?.surname;

  const {
    data: petition,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["petition", id],
    queryFn: () =>
      petitions.getById(Number(id), { locale: locale === "en" ? "en-GB" : (locale as string) }),
  });

  const [isTranslated, setIsTranslated] = useState(false);

  const { data: translatedPetition, isLoading: isLoadingT } = useQuery({
    queryKey: ["petition-t", id, locale],
    queryFn: () =>
      petitions.translate(Number(id), { locale: locale === "en" ? "en-GB" : (locale as string) }),
    enabled: isTranslated,
  });

  const data = isTranslated ? translatedPetition : petition;
  const { name, description, region, receiver } = data || {
    name: "",
    description: "",
    categories: [],
    region: 0,
    receiver: 0,
    isChecked: false,
    isConsented: false,
  };

  const hasInitiatedPetition = petition?.initiator.idnp === user?.idnp;
  const voters = petition?.signers || [];

  const generatePDF = async () => {
    const documentDefinition = {
      content: [
        {
          columns: [
            { width: "*", text: "" },
            {
              width: "auto",
              text: `${petition?.date?.split("T")[0]}, ${petition?.initiator.region.i18n[
                locale as "ro" | "ru" | "en"
              ]}`,
              fontSize: 10,
              alignment: "right",
            },
          ],
          columnGap: 10,
          marginTop: 10,
        },
        {
          text: petition?.name,
          fontSize: 16,
          bold: true,
          marginTop: 20,
          alignment: "center",
        },
        {
          text: convert(petition?.description),
          fontSize: 12,
          marginTop: 24,
        },
        {
          text: [{ text: "Inițiat de: ", bold: true }, fullName],
          fontSize: 12,
          marginTop: 24,
        },
        {
          text: [{ text: "Numărul de semnături: ", bold: true }, voters.length],
          fontSize: 12,
          marginTop: 8,
        },
        { text: "Lista semnatarilor:", fontSize: 12, marginTop: 6, bold: true },
        {
          ol: voters.map((voter: Signer) => ({ text: `${voter.name} ${voter.surname}` })),
          fontSize: 10,
          marginTop: 5,
        },
      ],
      footer: {
        columns: [
          {
            width: "*",
            text: "",
          },
          {
            image: msignImage,
            width: 50,
            alignment: "center",
            margin: [0, 0, 20, 0],
          },
        ],
      },
    };

    const pdfDocument = pdfMake.createPdf(documentDefinition);

    pdfDocument.download(`Petition-#${id}.pdf`);
  };

  const { mutate: deletePetition } = useMutation({
    mutationFn: () => petitions.delete(Number(id)),
    onSuccess: () => {
      window.location.reload();
    },
  });

  return (
    <Layout isFull>
      {isLoading || isLoadingT ? (
        <Flex w={"full"} h="100vh" justifyContent="center" mt={20} color="white">
          <Loader />
        </Flex>
      ) : isSuccess ? (
        <>
          <Flex w={"full"} h="200px" bg="primary.600" color="white">
            <VStack w={"full"} justify={"center"} px={8}>
              <Stack w="full" maxW={"8xl"} align={"flex-start"} justifyContent="start" spacing={6}>
                <Breadcrumb spacing="8px" separator={<ChevronRightIcon />}>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">{t("home")}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">
                      {t("petition")} #{id}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>
                <Heading as="h1" size="2xl" my={4}>
                  {t("petition")} #{id}
                </Heading>
              </Stack>
            </VStack>
          </Flex>
          <Container maxW="8xl" px={0} pb="100px">
            <HStack spacing={24} my={8} alignItems="start" position="relative">
              <VStack w="full" align={"flex-start"} justifyContent="start">
                {isTranslated ? (
                  <Button size="sm" colorScheme="gray" onClick={() => setIsTranslated(false)}>
                    {t("tr.view_original")}
                  </Button>
                ) : (
                  <Button size="sm" colorScheme="gray" onClick={() => setIsTranslated(true)}>
                    {t("tr.translate")}
                  </Button>
                )}

                <Heading as="h2" size="2xl" lineHeight="normal" my={4}>
                  {name}
                </Heading>

                <VStack spacing={4} pt={4} align="start" w="full">
                  <Heading as="h3" size="sm" fontWeight={400}>
                    <Text as="span" fontWeight="bold" fontFamily="serif">
                      {t("initiator")}:
                    </Text>{" "}
                    {fullName}
                  </Heading>

                  <Heading as="h3" size="sm" fontWeight={400}>
                    <Text as="span" fontWeight="bold" fontFamily="serif">
                      {t("creation_date")}:
                    </Text>{" "}
                    {petition.date?.split("T")[0]}
                  </Heading>

                  {petition.deadLine && (
                    <Heading as="h3" size="sm" fontWeight={400}>
                      <Text as="span" fontWeight="bold" fontFamily="serif">
                        {t("deadline")}:
                      </Text>{" "}
                      {petition.deadLine.split("T")[0]}
                    </Heading>
                  )}
                  <Heading as="h3" size="sm" fontWeight={400}>
                    <Text as="span" fontWeight="bold" fontFamily="serif">
                      {t("receiver")}:
                    </Text>{" "}
                    {petition.receiver.i18n[locale as "ro" | "ru" | "en"]}{" "}
                  </Heading>
                  {region && (
                    <Heading as="h3" size="sm" fontWeight={400}>
                      <Text as="span" fontWeight="bold" fontFamily="serif">
                        {t("region")}:
                      </Text>{" "}
                      {region.i18n[locale as "ro" | "ru" | "en"]}
                    </Heading>
                  )}
                  <HStack>
                    <Heading as="h3" size="sm" fontWeight={400}>
                      <Text as="span" fontWeight="bold" fontFamily="serif">
                        {t("categories")}:
                      </Text>{" "}
                    </Heading>
                    <HStack spacing={2}>
                      {petition.categories.map((category) => (
                        <Tag colorScheme="primary" key={category.id}>
                          {category.i18n[locale as "ro" | "ru" | "en"]}
                        </Tag>
                      ))}
                    </HStack>
                  </HStack>
                </VStack>

                <Text
                  fontSize="lg"
                  pt={8}
                  pb={2}
                  whiteSpace="pre-line"
                  dangerouslySetInnerHTML={{
                    __html: description,
                  }}
                />
              </VStack>
              <Box w="280px" position="sticky" top={4}>
                <PetitionProgressCard petition={petition} />
                {hasInitiatedPetition && (
                  <Button
                    w="full"
                    colorScheme="gray"
                    mt={8}
                    onClick={generatePDF}
                    leftIcon={<FaFilePdf />}
                  >
                    {t("save_as_pdf")}
                  </Button>
                )}
                <Share />
              </Box>
            </HStack>
          </Container>
        </>
      ) : (
        <Text>Something went wrong</Text>
      )}
    </Layout>
  );
};

export default Petition;
