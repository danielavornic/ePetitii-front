import { Flex, Text, SimpleGrid, Button } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Petition, PetitionStatus } from "@/types";
import { formatDateString } from "../helpers/helpers";

interface Props {
  petition: Petition;
}

const PetitionRow = ({ petition }: Props) => {
  const router = useRouter();
  return (
    <SimpleGrid
      onClick={() => {
        router.push("/admin/petitions/" + petition.id);
      }}
      spacing={20}
      border={"1px solid #ccc"}
      className="rounded-[8px] p-2 cursor-pointer"
      alignItems={"center"}
      columns={4}
      px={6}
    >
      <Text fontSize={"14px"} fontWeight={"bold"}>
        {petition.name}
      </Text>
      <Text fontSize={"14px"}>{petition.initiator.name}</Text>
      <Text fontSize={"14px"}>{formatDateString(petition.date)}</Text>

      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            {petition.status == PetitionStatus.declined ? (
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                {petition.status}
              </span>
            ) : petition.status == PetitionStatus.pending ||
              petition.status == PetitionStatus.pending_review ? (
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
                {petition.status}
              </span>
            ) : (
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                {petition.status}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div className="flex items-center"></div>
            </div>
            <div className="flex-shrink-0 h-2 bg-[#4d94ff] relative rounded-full">
              <div
                className="h-full bg-[#005ce6] rounded-full"
                style={{
                  width: `${
                    (petition.currSigns * 100) / petition.neededSigns > 100
                      ? 100
                      : (petition.currSigns * 100) / petition.neededSigns
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </SimpleGrid>
  );
};

export default PetitionRow;
