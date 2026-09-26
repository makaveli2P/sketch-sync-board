import { Head, Html, Main, NextScript } from 'next/document';

const Document = () => (
  <Html lang="en">
    <Head>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <body>
      <div id="portal" />
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
