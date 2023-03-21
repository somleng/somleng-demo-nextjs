import { PropsWithChildren } from "react";
import Head from "next/head";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Head>
        <title>Somleng Demo</title>
        <meta name="description" content="Somleng Demo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <section className="bg-white">{children}</section>
      </main>
    </>
  );
}
