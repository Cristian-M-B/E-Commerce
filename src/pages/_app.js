import Script from 'next/script'
import StoreProvider from '../context/StoreProvider'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { theme } from '../utils/theme'

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Script src='https://sdk.mercadopago.com/js/v2' />
        <Component {...pageProps} />
      </ThemeProvider>
    </StoreProvider>
  )
}

export default MyApp
