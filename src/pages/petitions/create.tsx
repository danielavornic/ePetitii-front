import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  VStack,
  Image,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { petitions } from "@/api";

import { PetitionFormData } from "@/types";
import { selectUser } from "@/store/selectors";
import { Layout, PetitionForm } from "@/components";

const initalState: PetitionFormData = {
  initiator_idnp: "",
  name: "",
  description: "",
  categories: [],
  receiver: 0,
  region: 0,
  isChecked: false,
  isConsented: false,
};

const CreatePetitionForm = ({
  setIsSubmitted,
  formData,
  setFormData,
}: {
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  formData: PetitionFormData;
  setFormData: React.Dispatch<React.SetStateAction<PetitionFormData>>;
}) => {
  const [errors, setErrors] = useState(initalState);

  return (
    <Layout isFull title="Creați o petiție">
      <Flex w={"full"} h="200px" bg="primary.600" color="white">
        <VStack w={"full"} justify={"center"} px={8}>
          <Stack w="full" maxW={"8xl"} align={"flex-start"} justifyContent="start" spacing={6}>
            <Breadcrumb spacing="8px" separator={<ChevronRightIcon />}>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Acasa</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#">Creați o petiție</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <Heading as="h1" size="2xl" my={4}>
              Creați o petiție
            </Heading>
          </Stack>
        </VStack>
      </Flex>
      <Container maxW="8xl">
        <PetitionForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          setIsSubmitted={setIsSubmitted}
        />
      </Container>
    </Layout>
  );
};

const CreatePetitionSubmitted = ({ formData }: { formData: PetitionFormData }) => {
  const { name, description, categories, receiver } = formData;

  const { user } = useSelector(selectUser);
  const { push } = useRouter();

  const { mutate } = useMutation({
    mutationFn: () =>
      petitions.create({
        name,
        description,
        categories,
        receiver,
        region: Number(user?.region),
        initiator_idnp: String(user?.idnp),
      }),
    onSuccess: (id) => {
      push(`/petitions/${id}`);
    },
  });

  const handleSignClick = () => {
    mutate();
  };

  return (
    <Container maxW="8xl" py={20} h="100vh" display="flex" alignItems="center" flexDir="column">
      <Image src="https://msign.gov.md/images/msign-logo.png" w="50%" marginX="auto" alt="msign" />
      <Button
        size="lg"
        colorScheme="purple"
        marginX="auto"
        display="block"
        onClick={handleSignClick}
        mt={20}
      >
        Semnează petiția
      </Button>
    </Container>
  );
};

const CreatePetition = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState(initalState);

  if (!isSubmitted) {
    return (
      <CreatePetitionForm
        setIsSubmitted={setIsSubmitted}
        formData={formData}
        setFormData={setFormData}
      />
    );
  }

  return <CreatePetitionSubmitted formData={formData} />;
};

export default CreatePetition;
