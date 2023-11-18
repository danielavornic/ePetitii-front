import { Button, Container, Image } from "@chakra-ui/react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { petitions } from "@/api";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/selectors";

const Msign = () => {
  const queryClient = useQueryClient();
  const { query, push } = useRouter();
  const petitionId = query.petitionId;

  const { user } = useSelector(selectUser);

  const { mutate } = useMutation({
    mutationFn: () =>
      petitions.sign(Number(petitionId), {
        initatior_idnp: String(user?.idnp),
      }),
    onSuccess: () => {
      push(`/petitions/${petitionId}`);
      queryClient.invalidateQueries({ queryKey: ["petition"] });
    },
    // TODO: handle error
    onError: () => {
      push(`/petitions/${petitionId}`);
      queryClient.invalidateQueries({ queryKey: ["petition"] });
    },
  });

  const handleClick = () => {
    mutate();
  };

  return (
    <Container
      maxW="8xl"
      py={20}
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
    >
      <Image src="https://msign.gov.md/images/msign-logo.png" w="50%" marginX="auto" alt="Msign" />
      <Button
        size="lg"
        colorScheme="purple"
        marginX="auto"
        display="block"
        onClick={handleClick}
        mt={20}
      >
        Semnează petiția
      </Button>
    </Container>
  );
};

export default Msign;
