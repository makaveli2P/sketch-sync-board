import '@/common/styles/global.css';

import { Provider } from 'jotai';
import { MotionConfig } from 'motion/react';
import type { AppProps } from 'next/app';
import { Montserrat } from 'next/font/google';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';

import { DEFAULT_EASE } from '@/common/constants/easings';
import { ModalManager } from '@/modules/modal';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat-next',
  display: 'swap',
});

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>SketchSync</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="A collaborative whiteboard. Draw together in real time." />
    </Head>
    {/* The font variable must be on <html>, because the portal is outside #__next. */}
    <style jsx global>{`
      :root {
        --font-montserrat-next: ${montserrat.style.fontFamily};
      }
    `}</style>
    <Provider>
      <ToastContainer />
      <MotionConfig transition={{ ease: DEFAULT_EASE }}>
        <ModalManager />
        <Component {...pageProps} />
      </MotionConfig>
    </Provider>
  </>
);

export default App;
