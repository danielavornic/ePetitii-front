import { Box, Flex, VStack } from "@chakra-ui/react";
import { Petition } from "@/types";
import { Loader, PetitionCard } from "@/components";

interface PetitionsListProps {
  petitions: Petition[];
  isLoading?: boolean;
}

export const PetitionsList = ({ petitions, isLoading }: PetitionsListProps) => {
  return (
    <VStack spacing={4} alignItems="stretch" w="full" mb={8}>
      {isLoading ? (
        <Flex w="full" justifyContent="center" pt={8}>
          <Loader />
        </Flex>
      ) : petitions && petitions.length > 0 ? (
        <>
          {petitions.slice(0, 10).map((petition) => (
            <PetitionCard petition={petition} key={petition.id} />
          ))}
        </>
      ) : (
        <Box w="full" textAlign="center" color="gray.500" fontSize="lg" py={8}>
          Nu există petiții
        </Box>
      )}
    </VStack>
  );
};
