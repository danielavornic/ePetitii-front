import { PropsWithChildren } from "react";
import Head from "next/head";
import { Container, VStack } from "@chakra-ui/react";
import { Header, Footer } from "@/components";

interface LayoutProps {
  title?: string;
  description?: string;
  isFull?: boolean;
  hasFooter?: boolean;
}

export const Layout = ({
  title,
  description,
  children,
  isFull = false,
  hasFooter = true,
}: PropsWithChildren<LayoutProps>) => {
  return (
    <>
      <Head>
        <title>{title ? `${title} e-Petiții` : "e-Petiții"}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <VStack
        minH="100vh"
        position="relative"
        overflowX="hidden"
        width="100%"
        spacing={0}
        align="stretch"
        justifyContent="space-between"
        bg="whiteAlpha.900"
      >
        <Header />
        <Container
          maxW={isFull ? "isFull" : ["container.sm", "container.md", "container.lg", "8xl"]}
          h="isFull"
          flex="1"
          py={isFull ? 0 : 20}
          px={isFull ? 0 : [4, 8, 12, 16]}
          as="main"
        >
          {children}
        </Container>
        {(!isFull || hasFooter) && <Footer />}
      </VStack>
    </>
  );
};
