import Link from "next/link";
import { CardBody, Heading, Card, Text, VStack, Progress, HStack } from "@chakra-ui/react";
import { Petition, PetitionStatus } from "@/types";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

interface PetitionCardProps {
  petition: Petition;
}

export const PetitionCard = ({ petition }: PetitionCardProps) => {
  const t = useTranslations("petition");

  const { locale } = useRouter();
  const { id, initiator, name, date, currSigns, neededSigns, deadline, categories, status } =
    petition;

  const deadlineTime = new Date(deadline);

  const daysLeft = Math.floor((deadlineTime.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  const progress = Math.floor((currSigns / neededSigns) * 100);

  const dateSplit = date ? date?.split("T")[0] : "";
  const progressColor =
    status === PetitionStatus.approved
      ? "green"
      : status === PetitionStatus.rejected
        ? "red"
        : status === PetitionStatus.pending_review || status === PetitionStatus.pending
          ? "blue"
          : "yellow";

  return (
    <Link href={`/petitions/${id}`}>
      <Card
        direction={{ base: "column", sm: "row" }}
        justify="start"
        overflow="hidden"
        variant="outline"
        p={4}
        transition="all 0.2s"
        cursor="pointer"
        role="group"
        _hover={{ boxShadow: "sm" }}
        w="full"
      >
        <CardBody flexDir="row" display="flex" alignItems="center">
          <VStack spacing={6} alignItems="start" flex="2" mr={12}>
            <HStack alignItems="baseline" fontFamily="serif">
              <Text>
                {dateSplit} |{" "}
                {categories
                  .map((category) => `#${category.i18n[locale as "ro" | "ru" | "en"]}`)
                  .join(", ")}
              </Text>
            </HStack>
            <Heading size="lg" transition="all 0.2s" _groupHover={{ color: "primary.500" }}>
              {name}
            </Heading>
            <HStack alignItems="baseline">
              <Text fontFamily="serif">
                {t("initiated_by")} {initiator.name} {initiator.surname}
              </Text>
            </HStack>
          </VStack>

          <VStack w="full" flex="0.6" alignItems="start" spacing={6}>
            <VStack w="full" alignItems="start">
              <HStack alignItems="baseline" justify="start" spacing={2}>
                <Heading size="lg">{currSigns}</Heading>
                <Text fontSize="md" fontFamily="serif" textTransform="lowercase">
                  {t("signatures")}
                </Text>
              </HStack>
              <Progress value={progress} colorScheme={progressColor} rounded="md" w="full" h={2} />
            </VStack>
            <HStack alignItems="baseline" fontFamily="serif" textTransform="lowercase">
              <Text>
                {daysLeft < 1 ? "60" : daysLeft} {t("remaining_days")}
              </Text>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </Link>
  );
};
