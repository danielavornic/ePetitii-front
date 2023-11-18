import { VStack } from "@chakra-ui/react";
import { Petition } from "@/types";
import { PopularPetitionItem } from ".";

interface PopularPetitionListProps {
  petitions: Petition[];
}

export const PopularPetitionsList = ({ petitions }: PopularPetitionListProps) => {
  return (
    <VStack spacing={4} alignItems="stretch" w="full">
      {petitions.map((petition) => (
        <PopularPetitionItem petition={petition} key={petition.id} />
      ))}
    </VStack>
  );
};
