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
import { useQuery } from "@tanstack/react-query";
import { petitions } from "@/api";
import { Layout, Loader, PetitionProgressCard } from "@/components";
import { FaFacebook, FaTwitter, FaEnvelope, FaLink } from "react-icons/fa";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/selectors";
import { useRouter } from "next/router";
import { Signer } from "@/types";
import { msignImage } from "@/constants";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Petition = () => {
  const { user } = useSelector(selectUser);
  const { query, locale } = useRouter();
  const id = query.id;

  const fullName = user?.name + " " + user?.surname;

  const {
    data: petitie,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["petition", id],
    queryFn: () => petitions.getById(Number(id)),
  });

  const voters = petitie?.signers || [];

  const hasInitiatedPetition = petitie?.initiator.idnp === user?.idnp;

  const generatePDF = async () => {
    const documentDefinition = {
      content: [
        {
          columns: [
            { width: "*", text: "" },
            {
              width: "auto",
              text: `${petitie?.date?.split("T")[0]}, ${user?.region}`,
              fontSize: 10,
              alignment: "right",
            },
          ],
          columnGap: 10,
          marginTop: 10,
        },
        {
          text: petitie?.name,
          fontSize: 16,
          bold: true,
          marginTop: 20,
          alignment: "center",
        },
        { text: petitie?.description, fontSize: 12, marginTop: 24 },
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
          ol: voters.map((voter: Signer) => ({ text: voter.name })),
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

  return (
    <Layout isFull>
      {isLoading ? (
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
                    <BreadcrumbLink href="/">Acasa</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href="#">Petiția #{id}</BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>
                <Heading as="h1" size="2xl" my={4}>
                  Petiția #{id}
                </Heading>
              </Stack>
            </VStack>
          </Flex>
          <Container maxW="8xl" px={0} pb="100px">
            <HStack spacing={24} my={8} alignItems="start" position="relative">
              <VStack w="full" align={"flex-start"} justifyContent="start">
                <Heading as="h2" size="2xl" lineHeight="normal" my={4}>
                  {petitie.name}
                </Heading>

                <Heading as="h3" size="sm" pt={4} pb={2} fontFamily="serif" fontWeight={400}>
                  <span style={{ fontWeight: "bold" }}>Inițiator:</span> {fullName}
                </Heading>

                <Heading as="h3" size="sm" fontFamily="serif" pb={2} fontWeight={400}>
                  <span style={{ fontWeight: "bold" }}>Data depunerii:</span>{" "}
                  {petitie.date?.split("T")[0]}
                </Heading>
                {petitie.deadline && (
                  <Heading as="h3" size="sm" fontFamily="serif" fontWeight={400}>
                    <span style={{ fontWeight: "bold" }}>Data limită:</span>{" "}
                    {petitie.deadline.split("T")[0]}
                  </Heading>
                )}
                {petitie?.region && (
                  <Heading as="h3" size="sm" fontFamily="serif" pt={2} fontWeight={400}>
                    <span style={{ fontWeight: "bold" }}>Locație:</span> {petitie.region.name}
                  </Heading>
                )}

                <Text fontSize="lg" pt={8} pb={2} whiteSpace="pre-line">
                  {petitie.description}
                </Text>

                <HStack pt={4} pb={2}>
                  <Heading as="h3" size="sm" fontFamily="serif" fontWeight={400}>
                    <span style={{ fontWeight: "bold" }}>Categorii:</span>{" "}
                  </Heading>
                  <HStack spacing={2}>
                    {petitie.categories.map((category) => (
                      <Tag key={category.id}>{category.i18n[locale as "ro" | "ru" | "en"]}</Tag>
                    ))}
                  </HStack>
                </HStack>
              </VStack>
              <Box w="280px" position="sticky" top={4}>
                <PetitionProgressCard petition={petitie} />
                {hasInitiatedPetition && (
                  <Button w="full" colorScheme="gray" mt={8} onClick={generatePDF}>
                    Salvează ca PDF
                  </Button>
                )}
                <VStack w="full" align={"flex-start"} justifyContent="start" spacing={4} pt={12}>
                  <Heading as="h3" size="sm" fontFamily="serif" fontWeight={400}>
                    Distribuie petiția
                  </Heading>
                  <HStack spacing={4}>
                    <IconButton
                      aria-label="Share on Facebook"
                      icon={<FaFacebook />}
                      rounded="full"
                    />
                    <IconButton aria-label="Share on Twitter" icon={<FaTwitter />} rounded="full" />
                    <IconButton aria-label="Share on Email" icon={<FaEnvelope />} rounded="full" />
                    <IconButton aria-label="Copy link" icon={<FaLink />} rounded="full" />
                  </HStack>
                </VStack>
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
