import { HomeHero, Layout, PetitionsSection } from "@/components";

export default function Home() {
  return (
    <Layout isFull>
      <HomeHero />
      <PetitionsSection />
    </Layout>
  );
}
