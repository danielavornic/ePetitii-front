import {
  Card,
  CardBody,
  CircularProgress,
  CircularProgressLabel,
  Heading,
  VStack,
  Text,
  Button,
} from "@chakra-ui/react";
import { Petition, PetitionStatus } from "@/types";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/selectors";
import Link from "next/link";

interface PetitionProgressCardProps {
  petition: Petition;
}

export const PetitionProgressCard = ({ petition }: PetitionProgressCardProps) => {
  const { user } = useSelector(selectUser);
  const { id, status, currSigns, neededSigns, deadline, initiator, signers, region } = petition;

  const progressColor =
    status === PetitionStatus.approved || status === PetitionStatus.pending
      ? "green.500"
      : status === PetitionStatus.rejected
        ? "red.500"
        : status === PetitionStatus.pending_review
          ? "blue.500"
          : "yellow.500";

  const percentage = (currSigns * 100) / neededSigns;
  const deadlineTime = new Date(deadline);
  const daysLeft = Math.floor((deadlineTime.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  let signButton;

  const commonButtonProps = {
    width: "200px",
    marginLeft: "auto",
    marginRight: "auto",
    rounded: "full",
    colorScheme: "blue",
  };

  if (user === null) {
    signButton = (
      <Button {...commonButtonProps} colorScheme="red" variant="link" fontWeight={500}>
        <Link href={`/mpass?petitionId=${id}`}>
          Autorizați-vă pentru <br /> a semna petiția
        </Link>
      </Button>
    );
  } else if (initiator.idnp !== user?.idnp) {
    const signedByUser = signers && signers.find((signer) => signer.idnp === user?.idnp);
    const isAllowedFromRegion =
      (!!petition?.region && user.region === petition?.region.id) || petition.receiver !== "Primar";

    const nowAllowedButtonProps = {
      ...commonButtonProps,
      variant: "link",
      fontWeight: 500,
      colorScheme: "red",
      // whiteSpace: "pre-line",
      // pointerEvents: "none",
    };

    signButton = (
      <Link href={`/msign?petitionId=${id}`}>
        <Button
          {...commonButtonProps}
          isDisabled={!!signedByUser}
          {...(!isAllowedFromRegion && nowAllowedButtonProps)}
        >
          {signedByUser
            ? "Ați signers petiția"
            : isAllowedFromRegion
              ? "Semnați petiția"
              : "Petiție indisponibilă \nîn regiunea dvs."}
        </Button>
      </Link>
    );
  } else {
    signButton = (
      <Button {...commonButtonProps}>
        <Link href={`/manage?petitionId=${id}`}>Administrați petiţia</Link>
      </Button>
    );
  }

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      justify="start"
      overflow="hidden"
      variant="outline"
      p={4}
      transition="all 0.2s"
      role="group"
      _hover={{ boxShadow: "sm" }}
      w="280px"
    >
      <CardBody flexDir="column" display="flex" alignItems="center">
        <VStack spacing="5">
          <Heading size="md">Semnături</Heading>
          <CircularProgress value={percentage} size="200px" color={progressColor} thickness="5px">
            <CircularProgressLabel>
              <VStack>
                <Heading size="lg">{petition.currSigns}</Heading>
                <Text fontSize="sm" fontFamily="serif">
                  din {petition.neededSigns}
                  <br />
                  necesare
                </Text>
              </VStack>
            </CircularProgressLabel>
          </CircularProgress>
          <VStack>
            <Text fontSize="md" fontFamily="serif" fontWeight="bold">
              {petition.status}
            </Text>
            <Text fontSize="sm" fontFamily="serif" mt={2}>
              {daysLeft < 1 ? "60" : daysLeft} zile rămase
            </Text>
          </VStack>
          <>{signButton}</>
        </VStack>
      </CardBody>
    </Card>
  );
};
