import { Heading } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { HomeHero, Layout, PetitionsSection } from "@/components";

export default function Home() {
  const t = useTranslations();

  return (
    <Layout isFull>
      <HomeHero />
      <PetitionsSection />
    </Layout>
  );
}
