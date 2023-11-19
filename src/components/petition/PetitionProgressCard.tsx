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
import { useTranslations } from "next-intl";

interface PetitionProgressCardProps {
  petition: Petition;
}

export const PetitionProgressCard = ({ petition }: PetitionProgressCardProps) => {
  const t = useTranslations("petition");
  const { user } = useSelector(selectUser);
  const { id, status, currSigns, neededSigns, deadLine, initiator, signers, region } = petition;

  const progressColor = status === PetitionStatus.pending ? "green.500" : "blue.500";

  const percentage = (currSigns * 100) / neededSigns;
  const deadLineTime = new Date(deadLine);
  const daysLeft = Math.floor((deadLineTime.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

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
        <Link href={`/mpass?petitionId=${id}`}>{t("login_to_sign")}</Link>
      </Button>
    );
  } else if (initiator.idnp !== user?.idnp) {
    const signedByUser = signers && signers.find((signer) => signer.idnp === user?.idnp);
    const isAllowedFromRegion =
      (!!petition?.region && user.region === petition?.region.id) ||
      petition.receiver.name !== "Primar";

    const nowAllowedButtonProps = {
      ...commonButtonProps,
      variant: "link",
      fontWeight: 500,
      colorScheme: "red",
    };

    signButton = (
      <Link href={`/msign?petitionId=${id}`}>
        <Button
          {...commonButtonProps}
          isDisabled={!!signedByUser}
          {...(!isAllowedFromRegion && nowAllowedButtonProps)}
        >
          {signedByUser
            ? t("you_signed_petition")
            : isAllowedFromRegion
              ? t("sign_petition")
              : "Petiție indisponibilă \nîn regiunea dvs."}
        </Button>
      </Link>
    );
  } else {
    signButton = (
      <Button {...commonButtonProps}>
        <Link href={`/petitions/${id}/edit`}>{t("edit")}</Link>
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
          <Heading size="md">{t("signatures")}</Heading>
          <CircularProgress value={percentage} size="200px" color={progressColor} thickness="5px">
            <CircularProgressLabel>
              <VStack>
                <Heading size="lg">{petition.currSigns}</Heading>
                <Text fontSize="sm" fontFamily="serif" textTransform="lowercase">
                  {t("of")} {petition.neededSigns}
                  <br />
                  {t("needed")}
                </Text>
              </VStack>
            </CircularProgressLabel>
          </CircularProgress>
          <VStack>
            <Text fontSize="md" fontFamily="serif" fontWeight="bold">
              {t(`status.${petition.status}`)}
            </Text>
            <Text fontSize="sm" fontFamily="serif" mt={2}>
              {daysLeft < 1 ? "60" : daysLeft} {t("remaining_days")}
            </Text>
          </VStack>
          <>{signButton}</>
        </VStack>
      </CardBody>
    </Card>
  );
};
