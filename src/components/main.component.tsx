'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Head from 'next/head';
import { persistor, store } from '@/redux/store.redux';

export function Main(props: any) {
  return (
    <div>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="icon" href="/favicon.svg" sizes="any" />
          </Head>
          {props.children}
        </PersistGate>
      </Provider>
    </div>
  );
}

export default Main;
