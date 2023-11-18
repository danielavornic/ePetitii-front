import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { NextIntlClientProvider } from "next-intl";
import { ChakraProvider, baseTheme, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "@/store";

import "@fontsource/libre-baskerville";
import "@fontsource/inter";

import ro from "@/dictionaries/ro.json";
import ru from "@/dictionaries/ru.json";
import en from "@/dictionaries/en.json";

const theme = extendTheme({
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
    serif: `'Libre Baskerville', serif`,
  },
  colors: {
    primary: baseTheme.colors.blue,
  },
  withDefaultColorScheme: {
    colorScheme: "brand",
  },
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const { locale } = useRouter();
  const messages = locale === "en" ? en : locale === "ru" ? ru : ro;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </Provider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  );
}
