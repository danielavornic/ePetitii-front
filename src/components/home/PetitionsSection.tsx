import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { HStack, VStack, Heading, Button, Tab, TabList, Tabs, Checkbox } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Select from "react-select";

import { Category, Petition, PetitionStatus } from "@/types";
import { petitions, categories as categoriesApi } from "@/api";
import popularPetitionsData from "@/data/petitions.json";
import { selectUser } from "@/store/selectors";
import { PetitionsList, PopularPetitionsList } from "@/components";

const statutes = Object.keys(PetitionStatus).map((status) => ({
  key: status,
  color: "blue",
}));

export const PetitionsSection = ({ hasTrending = true }: { hasTrending?: boolean }) => {
  const t = useTranslations();

  const { user } = useSelector(selectUser);

  const { query, push, locale } = useRouter();
  const { category_ids, sortBy, search, status, region } = query;

  const { data: categories, isSuccess: isCategoriesSuccess } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getList,
  });

  const { data, isFetching, isLoading, isSuccess } = useQuery({
    queryKey: [
      "petitions",
      {
        category_ids,
        sortBy,
        status,
        region,
        search,
      },
    ],
    queryFn: () =>
      petitions.getList({
        ...(category_ids && { category_ids: String(category_ids) }),
        ...(sortBy && { sortBy: String(sortBy) }),
        ...(status && { status: String(status) }),
        ...(user && user?.region && region ? { region: Number(user?.region) } : {}),
        ...(search && { search: String(search) }),
      }),
  });

  const updateParams = (key: string, value: string | number | boolean | undefined) => {
    push({
      pathname: !hasTrending ? "/petitions" : "/",
      query: {
        ...query,
        [key]: value,
      },
    });
  };

  const setCategory = (category: string) => updateParams("category_ids", category);
  const setSortBy = (sortBy: string) => updateParams("sortBy", sortBy);
  const setStatus = (status: string) => updateParams("status", status);

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
      pb={20}
      pt={hasTrending ? 20 : 0}
      maxW={["container.sm", "container.md", "container.lg", "8xl"]}
      mx="auto"
    >
      <VStack
        spacing={6}
        flex="2"
        borderRight={hasTrending ? "1px" : 0}
        borderColor="gray.200"
        pr={10}
      >
        <Heading size="xl" mb={4} alignSelf="center">
          {search ? `${t("petition.search_results_for")} "${search}"` : t("petition.petitions")}
        </Heading>
        <VStack spacing={4} w="full" alignItems="start">
          {user !== null && (
            <Checkbox
              isChecked={!!region}
              onChange={(e) => setAvailableByLocation(e.target.checked)}
            >
              {t("filter.only_my_region")}
            </Checkbox>
          )}
          <HStack w="full" justifyContent="space-between" alignItems="center">
            <Select
              styles={{
                control: (provided) => ({
                  ...provided,
                  minWidth: "300px",
                }),
              }}
              onChange={(option: any) => setCategory(option ? option.value : undefined)}
              options={categories?.map((category: Category) => ({
                label: category.i18n[locale as "ro" | "ru" | "en"],
                value: category.id,
              }))}
              placeholder={t("filter.categories")}
            />

            <HStack h="40px" spacing={4}>
              <Button
                variant={sortBy === "new" ? "outline" : "ghost"}
                colorScheme="blue"
                onClick={() => setSortBy("new")}
                rounded="full"
              >
                {t("sort.newest")}
              </Button>
              <Button
                variant={sortBy === "popular" ? "outline" : "ghost"}
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

      {hasTrending && (
        <VStack spacing={6} flex="1" pl={7}>
          <Heading size="xl" mb={4}>
            Trending
          </Heading>
          <PopularPetitionsList
            petitions={popularPetitionsData.slice(0, 5) as unknown as Petition[]}
          />
        </VStack>
      )}
    </HStack>
  );
};
