import {
  HStack,
  VStack,
  Heading,
  Select,
  Button,
  Tab,
  TabList,
  Tabs,
  Checkbox,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { Category, Petition, PetitionStatus } from "@/types";
import { petitions, categories as categoriesApi } from "@/api";
import { PetitionsList, PopularPetitionsList } from "@/components";
import popularPetitionsData from "@/data/petitions.json";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/selectors";

const statutes = Object.keys(PetitionStatus).map((status) => ({
  key: status,
  color: "blue",
}));

export const PetitionsSection = () => {
  const t = useTranslations();

  const { user } = useSelector(selectUser);

  const { query, push, locale } = useRouter();
  const { category, sort, search, status, region } = query;

  const { data: categories, isSuccess: isCategoriesSuccess } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getList,
  });

  const { data, isFetching, isLoading, isSuccess } = useQuery({
    queryKey: [
      "petitions",
      {
        category,
        sort,
        status,
      },
    ],
    queryFn: () => petitions.getList({ categories, sort: String(sort), status: String(status) }),
  });

  const updateParams = (key: string, value: string | number | boolean | undefined) => {
    push(
      {
        pathname: "/",
        query: {
          ...query,
          [key]: value,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  const setCategory = (category: string) => updateParams("categories", category);
  const setSortBy = (sortBy: string) => updateParams("sort", sortBy);
  const setStatus = (status: string) => updateParams("status", status);

  // TODO: implement this
  const setAvailableByLocation = (availableByLocation: boolean) => {
    if (availableByLocation) {
      updateParams("region", Number(user?.region));
    } else {
      updateParams("region", undefined);
    }
  };

  return (
    <HStack
      as="section"
      w="full"
      h="max-content"
      justifyContent="space-between"
      alignItems="stretch"
      py={20}
      maxW={["container.sm", "container.md", "container.lg", "8xl"]}
      mx="auto"
    >
      <VStack spacing={6} flex="2" borderRight="1px" borderColor="gray.200" pr={10}>
        <Heading size="xl" mb={4} alignSelf="center">
          {search ? `${t("petition.search_results_for")} "${search}"` : t("petition.petitions")}
        </Heading>
        <VStack spacing={4} w="full" alignItems="start">
          {user !== null && (
            <Checkbox
              isChecked={region !== null}
              onChange={(e) => setAvailableByLocation(e.target.checked)}
            >
              {t("filter.only_my_region")}
            </Checkbox>
          )}
          <HStack w="full" justifyContent="space-between" alignItems="center">
            <Select
              w="xs"
              rounded="full"
              defaultValue={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {isCategoriesSuccess &&
                categories?.length &&
                categories.map((category: Category) => (
                  <option value={category.id} key={category.id}>
                    {category.i18n[locale as "ro" | "ru" | "en"]}
                  </option>
                ))}
            </Select>

            <HStack h="40px" spacing={4}>
              <Button
                variant={sort === "newest" ? "outline" : "ghost"}
                colorScheme="blue"
                onClick={() => setSortBy("newest")}
                rounded="full"
              >
                {t("sort.newest")}
              </Button>
              <Button
                variant={sort === "popular" ? "outline" : "ghost"}
                colorScheme="blue"
                onClick={() => setSortBy("popular")}
                rounded="full"
              >
                {t("sort.most_popular")}
              </Button>
            </HStack>
          </HStack>
        </VStack>

        <Tabs w="full">
          <TabList>
            {statutes.map((status) => (
              <Tab key={status.key} onClick={() => setStatus(status.key)}>
                {t(`petition.status.${status.key}`)}
              </Tab>
            ))}
          </TabList>
        </Tabs>

        {isSuccess && <PetitionsList isLoading={isFetching || isLoading} petitions={data} />}
      </VStack>

      <VStack spacing={6} flex="1" pl={7}>
        <Heading size="xl" mb={4}>
          Trending
        </Heading>
        <PopularPetitionsList
          petitions={popularPetitionsData.slice(0, 5) as unknown as Petition[]}
        />
      </VStack>
    </HStack>
  );
};
