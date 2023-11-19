import { HStack, Heading, IconButton, VStack } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { FaLink } from "react-icons/fa";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";

const Share = () => {
  const t = useTranslations("petition");
  const { asPath } = useRouter();
  const url = `${process.env.NEXT_PUBLIC_HOST_URL}`;

  return (
    <VStack w="full" align={"flex-start"} justifyContent="start" spacing={4} pt={12}>
      <Heading as="h3" size="sm" fontWeight={400}>
        {t("share_petition")}
      </Heading>
      <HStack spacing={4}>
        <FacebookShareButton url={url}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>
        <TwitterShareButton url={url}>
          <TwitterIcon size={40} round />
        </TwitterShareButton>
        <EmailShareButton url={url}>
          <EmailIcon size={40} round />
        </EmailShareButton>
        <IconButton aria-label="Copy link" icon={<FaLink />} rounded="full" />
      </HStack>
    </VStack>
  );
};

export default Share;
