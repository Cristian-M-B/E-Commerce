import Head from 'next/head'
import Nav from './Nav'
import Footer from './Footer'
import { Container } from '@mui/material'

export default function Layout({ children }) {
    return (
        <>
            <Head>
                <title>E-Commerce | Inicio</title>
            </Head>
            <Nav />
            <Container style={{ minHeight: '84vh', paddingTop: '4vh', paddingBottom: '4vh' }}>
                {children}
            </Container>
            <Footer />
        </>
    )
}