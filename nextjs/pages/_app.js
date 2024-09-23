import "@/styles/globals.css";
import React from "react";
import { useRouter } from "next/router";
import { AppCacheProvider } from "@mui/material-nextjs/v13-pagesRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";
import Layout from "@/components/layout";
import useBearStore from "@/store/useBearStore";
import Head from "next/head";
import { Backdrop, CircularProgress } from "@mui/material";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  palette: {},
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default function App({ Component, pageProps, props }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const setAppName = useBearStore((state) => state.setAppName);
  const pageName = router.pathname;

  React.useEffect(() => {
    console.log("App load", pageName, router.query);
    setLoading(true);
    setAppName("Maejoo Hathaway")
    setLoading(false);
  }, [router, pageName]);

  return (
    <React.Fragment>
      <Head>
        <title>{`Application`}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppCacheProvider {...props}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
      </AppCacheProvider>
    </React.Fragment>
  );
}
