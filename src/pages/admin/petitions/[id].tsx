import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import RootLayout from "../components/RootLayout";
import { Box, Heading, Text, Progress, Badge, Flex, Button, HStack } from "@chakra-ui/react";
import { samplePetition } from "../SampleData";
import { Petition, PetitionStatus } from "@/types";
import axios from "axios";
import { formatDateString } from "../helpers/helpers";
import { stat } from "fs";

const AdminPetition = () => {
  const { query, locale } = useRouter();
  const [petition, setPetition] = useState<Petition>();
  const [isTranslated, setIsTranslated] = useState(0);
  const id = query.id;
  useEffect(() => {
    initRequest();
  }, [id]);

  const accept = async () => {
    const response = await axios.post("http://192.168.8.100:8080/api/petition/accept/" + id);
    setIsTranslated(1);
  };

  const reject = async () => {
    const response = await axios.post("http://192.168.8.100:8080/api/petition/decline/" + id);
    console.log(response.data);
    setIsTranslated(2);
  };

  const initRequest = async () => {
    if (id != undefined) {
      const respone = await axios.get(
        "http://192.168.8.100:8080/api/petition/" + id + "/translate?locale=ro",
      );
      console.log(respone.data);
      setPetition(respone.data);
    }
  };
  return (
    petition != undefined && (
      <RootLayout navHeader="Petition details">
        <div className=" w-full h-[100vh]">
          <Flex alignItems={"center"} justifyContent={"center"} className=" w-full">
            <Box
              p={4}
              shadow="md"
              h="full"
              borderWidth="1px"
              className="max-w-90% w-full mx-auto bg-white"
              style={{ maxHeight: "900px", overflowY: "auto" }}
            >
              <Heading fontSize="xl">{petition.name}</Heading>
              <Text mt={2}>
                Initiated by: {petition.initiator.name} {petition.initiator.surname}
              </Text>
              <Text mt={2} color="gray.600">
                {formatDateString(petition.date)}
              </Text>
              <Progress
                colorScheme={petition.currSigns < petition.neededSigns ? "blue" : "green"}
                size="sm"
                value={(petition.currSigns / petition.neededSigns) * 100}
                mt={2}
              />
              <Text mt={2}>
                {petition.currSigns} / {petition.neededSigns} signatures
              </Text>
              <Text
                mt={2}
                dangerouslySetInnerHTML={{
                  __html: petition.description,
                }}
              />
              <Text mt={2}>Receiver: {petition.receiver.name}</Text>
              <Badge
                colorScheme={
                  isTranslated == 2
                    ? "red"
                    : petition.status === PetitionStatus.completed
                      ? "green"
                      : PetitionStatus.pending
                        ? "yellow"
                        : "red"
                }
                mt={2}
              >
                {isTranslated == 1
                  ? "pending"
                  : isTranslated == 2
                    ? "declined"
                    : PetitionStatus[petition.status]}
              </Badge>
              <Text mt={2}>Deadline: {petition.deadline}</Text>
              <Box mt={4}>
                {petition.categories.map((category) => (
                  <Badge key={category.id} mr={2}>
                    {category.name}
                  </Badge>
                ))}
              </Box>
              <HStack>
                {petition.status == "pending_review" && isTranslated == 0 ? (
                  <>
                    <Button colorScheme="blue" w={"full"} mt={8} variant={"ghost"} onClick={reject}>
                      Reject
                    </Button>
                    <Button colorScheme="blue" w={"full"} mt={8} onClick={accept}>
                      Approve
                    </Button>
                  </>
                ) : null}
              </HStack>
            </Box>
          </Flex>
        </div>
      </RootLayout>
    )
  );
};
export default AdminPetition;
