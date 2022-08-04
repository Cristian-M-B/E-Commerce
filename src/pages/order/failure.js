import Head from 'next/head'
import Layout from '../../components/Layout'
import { Grid, Typography } from '@mui/material'

export default function Failure() {
    return (
        <Layout>
            <Head>
                <title>E-Commerce | Pago Rechazado</title>
            </Head>
            <Grid container direction='column' justifyContent='center' alignItems='center' style={{minHeight: '75vh'}}>
                <Typography variant='h5' component='h5'>¡Por alguna razón tú pago fue rechazado!</Typography>
                <Typography variant='h6' component='h6'>Intenta nuevamente o prueba con otro medio de pago.</Typography>
            </Grid>
        </Layout>
    )
}