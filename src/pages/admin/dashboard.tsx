import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Grid, GridItem, Flex, HStack } from "@chakra-ui/react";
// import Petition from "../petitions/[id]";
import PetitionRow from "./components/PetitionRow";
import RootLayout from "./components/RootLayout";
import Select from "react-select";
import { petitions, categories as categoriesApi } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Category, Petition } from "@/types";
import axios from "axios";

const Dashboard = ({ hasTrending = true }: { hasTrending?: boolean }) => {
  const { query, push, locale } = useRouter();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const { category, sort, search, status, region } = query;
  const [isClient, setIsClient] = useState(false);

  const { data: categories, isSuccess: isCategoriesSuccess } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getList,
  });

  function formatDateString(dateStr: string): string {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Parse the date string
    const dateObj = new Date(dateStr);

    // Format the date
    const year = dateObj.getFullYear();
    const month = months[dateObj.getMonth()];
    const day = dateObj.getDate();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    // Pad minutes with leading zero if needed
    const paddedMinutes = minutes.toString().padStart(2, "0");

    return `${month} ${day}, ${year}, ${hours}:${paddedMinutes}`;
  }

  // Example usage
  const dateStr = "2023-08-18T23:00:00.000+00:00";
  console.log(formatDateString(dateStr));

  const [selectedCategory, setSelectdCategory] = useState<Category>();

  const updateParams = (key: string, value: string | number | boolean | undefined) => {
    push(
      {
        pathname: !hasTrending ? "/petitions" : "/",
        query: {
          ...query,
          [key]: value,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  useEffect(() => {
    initialRequest();
    setIsClient(true);
  }, [selectedCategory]);

  const initialRequest = async () => {
    if (selectedCategory == undefined) {
      const respone = await axios.get("http://192.168.8.100:8080/api/petition?admin=true");
      setPetitions(respone.data);
    } else {
      const respone = await axios.get(
        "http://192.168.8.100:8080/api/petition?category_ids=" + selectedCategory,
      );
      setPetitions(respone.data);
    }
  };

  return (
    isClient && (
      <>
        <RootLayout navHeader="Dashboard">
          <HStack w="full" justifyContent="space-between" alignItems="center">
            <Select
              className="mb-6"
              styles={{
                control: (provided) => ({
                  ...provided,
                  minWidth: "300px",
                }),
              }}
              onChange={(option: any) => setSelectdCategory(option ? option.value : undefined)}
              options={categories?.map((category: Category) => ({
                label: category.i18n[locale as "ro" | "ru" | "en"],
                value: category.id,
              }))}
            />
          </HStack>
          <Flex flexDirection={"column"} rowGap={4}>
            {/* <PetitionRow
            progress={100}
            name={"Sprijin pentru dezvoltarea tinerilor în domeniul tehnologic."}
            date="25.02.2002"
            author="Marin Druta"
          />
          <PetitionRow
            progress={80}
            name={"Something to do with the environment."}
            date="25.02.2002"
            author="Marin Drutoi"
          />
          <PetitionRow
            progress={80}
            name={"Something to do with the environment."}
            date="25.02.2002"
            author="Marin Drutoi"
          />
          <PetitionRow
            progress={80}
            name={"Something to do with the environment."}
            date="25.02.2002"
            author="Marin Drutoi"
          />
          <PetitionRow
            progress={80}
            name={"Something to do with the environment."}
            date="25.02.2002"
            author="Marin Drutoi"
          /> */}
            {petitions?.length > 0 &&
              petitions?.map((petition) => <PetitionRow key={petition.id} petition={petition} />)}
          </Flex>
        </RootLayout>
      </>
    )
  );
};

export default Dashboard;
