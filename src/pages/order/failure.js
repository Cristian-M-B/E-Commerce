import Head from 'next/head'
import Layout from '../../components/Layout'
import { Grid, Typography } from '@mui/material'

export default function Failure() {
    return (
        <Layout>
            <Head>
                <title>E-Commerce | Pago Rechazado</title>
            </Head>
            <Grid container direction='column' justifyContent='center' alignItems='center' style={{ minHeight: '75vh' }}>
                <img src='/error.png' width='100' height='100' style={{ marginBottom: '50px' }} />
                <Typography variant='h5' component='h5' align='center'>¡Por alguna razón tú pago fue rechazado!</Typography>
                <Typography variant='h6' component='h6' align='center'>Intenta nuevamente o prueba con otro medio de pago.</Typography>
            </Grid>
        </Layout>
    )
}