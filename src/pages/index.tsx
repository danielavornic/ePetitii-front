import Head from "next/head";
import { Heading } from "@chakra-ui/react";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();

  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
      <main>
        <Heading>{t("hi")}</Heading>
      </main>
    </>
  );
}
