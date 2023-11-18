import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import Select from "react-select";
import { Category, PetitionFormData } from "@/types";

import wash from "washyourmouthoutwithsoap";
import { useQuery } from "@tanstack/react-query";
import { regions, categories as categoriesApi, receivers as receiversApi } from "@/api";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/selectors";
import { useEffect } from "react";

interface PetitionFormProps {
  formData: PetitionFormData;
  setFormData: React.Dispatch<React.SetStateAction<PetitionFormData>>;
  errors: PetitionFormData;
  setErrors: React.Dispatch<React.SetStateAction<PetitionFormData>>;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

const initalState: PetitionFormData = {
  initiator_idnp: "",
  name: "",
  description: "",
  categories: [],
  receiver: 0,
  region: 0,
  isChecked: false,
  isConsented: false,
};

export const PetitionForm = ({
  formData,
  setFormData,
  errors,
  setErrors,
  setIsSubmitted,
}: PetitionFormProps) => {
  const { name, description, categories, region, receiver, isChecked, isConsented } = formData;
  const isPrimar = receiver === 3;
  const { user } = useSelector(selectUser);

  useEffect(() => {
    if (user?.region) {
      setFormData({ ...formData, region: user.region });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const { data: regionOptions } = useQuery({
    queryKey: ["regions"],
    queryFn: regions.getList,
  });

  const { data: receivers } = useQuery({
    queryKey: ["receivers"],
    queryFn: receiversApi.getList,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories-form"],
    queryFn: categoriesApi.getList,
  });

  const isSubmitDisabled =
    !name ||
    !description ||
    !categories.length ||
    !receiver ||
    description.length < 100 ||
    (isPrimar && !region) ||
    !isChecked ||
    !isConsented;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "name" && e.target.value.length < 10) {
      setErrors({ ...errors, name: "Titlul trebuie să aibă minim 10 caractere" });
    }

    if (e.target.name === "name" && e.target.value.length >= 10) {
      setErrors({ ...errors, name: "" });
    }

    const isProfane = wash.check("ro", e.target.value);

    if (e.target.name === "description" && e.target.value.length < 100) {
      setErrors({ ...errors, description: "Conținutul trebuie să aibă minim 100 caractere" });
    } else if (isProfane) {
      setErrors({ ...errors, description: "Conținutul petiției conține cuvinte obscene" });
    } else {
      setErrors({ ...errors, description: "" });
    }
  };
  console.log(wash.words("ro"));

  return (
    <form onSubmit={handleSubmit} id="petitie-form">
      <VStack spacing={8} py={8} pb="200px">
        <FormControl isInvalid={!!errors.name || (name.length < 10 && !!name)}>
          <FormLabel fontWeight="bold" fontSize="xl">
            Titlu*
          </FormLabel>
          <FormHelperText fontSize="sm" color="gray.500" mb={4}>
            Titlul trebuie să fie descriptiv și să reflecte conținutul petiției. Folosește minim 10
            caractere
          </FormHelperText>
          <Input
            type="text"
            placeholder="Titlu"
            name="name"
            value={name}
            onChange={handleChange}
            required
            size="lg"
          />
          <FormErrorMessage>
            {name.length < 10 && !!name ? "Titlul trebuie să aibă minim 10 caractere" : ""}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormLabel fontWeight="bold" fontSize="xl">
            Conținut*
          </FormLabel>
          <FormHelperText fontSize="sm" color="gray.500" mb={4}>
            Conținutul petiției trebuie să fie detaliat și să conțină minim 100 de caractere.
          </FormHelperText>
          <Textarea
            placeholder="Conținut"
            name="description"
            value={description}
            onChange={handleChange}
            h="300px"
            maxLength={2000}
            fontSize="lg"
          />
          <HStack w="full" justifyContent={errors.description ? "space-between" : "flex-end"}>
            <FormErrorMessage>{errors.description}</FormErrorMessage>
            <FormHelperText fontSize="sm" color="gray.500" textAlign="right">
              {description.length}/2000 caractere
            </FormHelperText>
          </HStack>
        </FormControl>

        <HStack justifyContent="space-between" alignItems="start" w="full" spacing={8}>
          <FormControl>
            <FormLabel fontWeight="bold" fontSize="xl">
              Destinatar*
            </FormLabel>
            <FormHelperText fontSize="sm" color="gray.500" mb={4}>
              Selectează destinatarul petiției din lista de mai jos.
            </FormHelperText>
            <Select
              options={receivers?.map((receiver: Category) => ({
                label: receiver.name,
                value: receiver.id,
              }))}
              onChange={(option: any) =>
                setFormData({
                  ...formData,
                  receiver: option ? option.value : 0,
                  region: undefined,
                })
              }
              styles={{
                control: (provided) => ({
                  ...provided,
                  fontSize: "1.125rem",
                  height: "3rem",
                }),
              }}
            />
            {errors.receiver ? <FormErrorMessage>{errors.receiver}</FormErrorMessage> : null}
          </FormControl>
          <FormControl isInvalid={!!errors.region}>
            <FormLabel fontWeight="bold" fontSize="xl">
              Regiune
            </FormLabel>
            <FormHelperText fontSize="sm" color="gray.500" mb={4}>
              Regiunea se completează automat în funcție de regiunea din buletinul de identitate.
            </FormHelperText>
            <Input
              type="text"
              size="lg"
              value={regionOptions?.find((r: Category) => r.id === region)?.name}
              readOnly
            />
          </FormControl>
        </HStack>
        <FormControl>
          <FormLabel fontWeight="bold" fontSize="xl">
            Categorii
          </FormLabel>
          <FormHelperText fontSize="sm" color="gray.500" mb={4}>
            Alege una sau mai multe categorii care descriu cel mai bine petiția ta.
          </FormHelperText>
          <Select
            isMulti
            options={categoriesData?.map((category: Category) => ({
              label: category.name,
              value: category.id,
            }))}
            onChange={(option) =>
              setFormData({
                ...formData,
                categories: option ? option.map((o: any) => o.value) : [],
              })
            }
            styles={{
              control: (provided) => ({
                ...provided,
                fontSize: "1.125rem",
                height: "3rem",
              }),
            }}
          />
        </FormControl>

        <VStack w="full">
          <FormControl>
            <Checkbox
              name="isChecked"
              checked={isChecked}
              onChange={(e) => setFormData({ ...formData, isChecked: e.target.checked })}
            >
              *Am verificat datele introduse şi confirm corectitudinea lor, pe proprie răspundere*
            </Checkbox>
          </FormControl>
          <FormControl>
            <Checkbox
              name="isConsented"
              checked={isConsented}
              onChange={(e) => setFormData({ ...formData, isConsented: e.target.checked })}
            >
              *În temeiul{" "}
              <Text as="span" color={"primary.500"} textDecoration="underline">
                articolelor 6, 8, 9 ale Legii nr. 133 din 08.07.2011
              </Text>
              , îmi exprim consimţământul pentru prelucrarea datelor cu caracter personal care mă
              vizează în scopul procesării petiției.*
            </Checkbox>
          </FormControl>
        </VStack>

        <HStack w="full" justifyContent="space-between">
          <Button
            type="submit"
            colorScheme="blue"
            w="full"
            isDisabled={isSubmitDisabled}
            form="petitie-form"
          >
            Trimite petiția
          </Button>

          <Button
            type="button"
            colorScheme="gray"
            w="full"
            onClick={() => setFormData(initalState)}
            form="petitie-form"
          >
            Salvează și continuă mai târziu
          </Button>
        </HStack>

        <Text fontSize="sm" color="gray.500" textAlign="center">
          * Aceste câmpuri sunt obligatorii. Petițiile sunt procesate de către{" "}
          <Text as="span" color={"primary.500"} textDecoration="underline">
            Direcția Petiții și Audiențe
          </Text>
          .
        </Text>
      </VStack>
    </form>
  );
};
