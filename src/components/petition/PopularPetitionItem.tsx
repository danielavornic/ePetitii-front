import Link from "next/link";
import { CircularProgress, CircularProgressLabel, HStack, Heading } from "@chakra-ui/react";
import { Petition } from "@/types";

interface PopularPetitionItemProps {
  petition: Petition;
}

export const PopularPetitionItem = ({ petition }: PopularPetitionItemProps) => {
  const { id, name, currSigns, neededSigns } = petition;

  const progress = Math.floor((currSigns / neededSigns) * 100);

  return (
    <Link href={`/petitions/${id}`}>
      <HStack spacing={4} role="group" w="full" justifyContent="space-between">
        <Heading size="sm" transition="all 0.2s" _groupHover={{ color: "primary.500" }}>
          {name}
        </Heading>
        <CircularProgress value={progress} color="green.500" size="50px" thickness="5px">
          <CircularProgressLabel>{progress}%</CircularProgressLabel>
        </CircularProgress>
      </HStack>
    </Link>
  );
};
