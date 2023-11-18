import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useRouter } from "next/router";

export const LanguageSwitcher = () => {
  const { locale, push, asPath } = useRouter();
  const languages = ["ro", "ru", "en"];

  const handleChange = (lang: string) => {
    push(asPath, asPath, { locale: lang });
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        size="sm"
        variant="link"
        color="black"
        fontSize="sm"
        fontWeight="light"
        textTransform="uppercase"
      >
        {locale}
      </MenuButton>
      <MenuList minWidth="36px" p={1}>
        {languages
          .filter((lang) => lang !== locale)
          .map((lang) => (
            <MenuItem
              key={lang}
              onClick={() => handleChange(lang)}
              textTransform="uppercase"
              width="36px"
              fontSize="xs"
              p={2}
            >
              {lang}
            </MenuItem>
          ))}
      </MenuList>
    </Menu>
  );
};
