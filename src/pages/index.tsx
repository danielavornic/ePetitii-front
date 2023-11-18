import { HomeHero, Layout, PetitionsSection, CustomModal } from "@/components";

export default function Home() {
  return (
    <Layout isFull>
      <CustomModal />
      <HomeHero />
      <PetitionsSection />
    </Layout>
  );
}
