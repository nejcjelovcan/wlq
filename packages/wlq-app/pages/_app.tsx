import { ChakraProvider } from '@chakra-ui/core'
import { AppProps } from 'next/app'
import { createOvermind } from 'overmind'
import { Provider } from 'overmind-react'
import React from 'react'
// import { makeServer } from '../mirage'
import Layout from '../src/components/Layout'
import { config } from '../src/overmind'
import theme from '../src/theme'

// if (process.env.NODE_ENV === 'development') {
//   makeServer({ environment: 'development' })
// }

const overmind = createOvermind(config, {
  devtools: process.env.NODE_ENV === 'development',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider value={overmind}>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </Provider>
  )
}
