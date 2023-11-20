import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  FormErrorMessage,
  Text,
  Flex,
} from "@chakra-ui/react";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ActionMeta, MultiValue, OptionBase, Select } from "chakra-react-select";
import { useRouter } from "next/router";
import { Category } from "@/types";
import { categories as categoriesApi, emails } from "@/api";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/store/selectors";
import { subscribe } from "@/store/user";

interface OptionType extends OptionBase {
  value: string;
  label: string;
}

export const CustomModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  const [isInvalid, setIsInvalid] = useState(false);
  const [email, setEmail] = useState("");
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const { locale } = useRouter();

  const { data: categories, isSuccess: isCategoriesSuccess } = useQuery({
    queryKey: ["modalCategories"],
    queryFn: categoriesApi.getList,
  });

  const t = useTranslations();

  const options = categories?.map((category: Category) => ({
    value: category.id.toString(),
    label: category.i18n[locale as "ro" | "ru" | "en"],
  }));

  const handleChange = (selected: MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
    setSelectedOptions(selected as OptionType[]);
    if (wasSubmitted) {
      setWasSubmitted(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (isInvalid) {
      setIsInvalid(false);
    }
  };

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = () => {
    setWasSubmitted(true);
    let isValid = true;

    if (!validateEmail(email)) {
      setIsInvalid(true);
      isValid = false;
    }

    if (selectedOptions.length === 0) {
      isValid = false;
    }

    if (isValid) {
      mutate();
      console.log("Valid email:", email);
      // Handle valid submission here
    }
  };

  const { user } = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("User:", user);
    if (user && !user.isSubscribed) {
      onOpen();
    }
  }, [user]);

  const { mutate } = useMutation({
    mutationFn: () =>
      emails.subscribe({
        email,
        categories: selectedOptions.map((option) => Number(option.value)),
      }),
    onSuccess: () => {
      onClose();
      dispatch(subscribe());
      localStorage.setItem("isSubscribed", "true");
    },
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Flex alignItems="center" justify="center" pt="40px">
            <Image src="/newsLetter.png" alt="Newsletter" width={120} height={120} />
          </Flex>
          <ModalHeader>
            <Flex justifyContent="center">
              <Text textAlign={"center"}>{t("modal.header")}</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              isMulti
              options={isCategoriesSuccess && categories?.length ? options : []}
              value={selectedOptions}
              onChange={handleChange}
              placeholder={t("placeholders.selectCategory")}
            />
            {wasSubmitted && selectedOptions.length === 0 && (
              <Text pt={1} pr={1} pl={1} color="red.500" fontSize="sm">
                {t("errors.categoryRequired")}
              </Text>
            )}
            <FormControl pt={4} isInvalid={isInvalid}>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder={t("placeholders.enterEmail")}
              />
              {isInvalid && <FormErrorMessage pl={1}>{t("errors.invalidEmail")}</FormErrorMessage>}
            </FormControl>
            <></>
            <Text
              fontSize="12px" // Medium font size
              color="gray.600" // Grayish color for a softer look
              lineHeight="tall" // Taller line height for readability
              mt={4} // Margin top for spacing
              textAlign="center" // Center-aligned text
            >
              {t("modal.description")}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} variant="ghost" onClick={onClose}>
              {t("modal.cancel")}
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {t("modal.subscribe")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
