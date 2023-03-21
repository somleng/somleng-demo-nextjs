import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@material-tailwind/react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Layout from "../components/layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GoogleReCaptchaProvider>
    </ThemeProvider>
  );
}
