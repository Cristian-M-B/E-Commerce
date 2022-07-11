import StoreProvider from '../context/StoreProvider'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { theme } from '../utils/theme'

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </StoreProvider>
  )
}

export default MyApp
