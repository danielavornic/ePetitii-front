import { Layout, PetitionsSection } from "@/components";
import { useTranslations } from "next-intl";

const Petitions = () => {
  const t = useTranslations("petition");
  return (
    <Layout title={t("petitions")}>
      <PetitionsSection hasTrending={false} />
    </Layout>
  );
};

export default Petitions;
