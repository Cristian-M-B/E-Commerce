import Head from 'next/head'
import Layout from '../../components/Layout'
import { Grid, Typography } from '@mui/material'

export default function Pending() {
    return (
        <Layout>
            <Head>
                <title>E-Commerce | Pago Pendiente</title>
            </Head>
            <Grid container direction='column' justifyContent='center' alignItems='center' style={{minHeight: '75vh'}}>
                <Typography variant='h5' component='h5'>¡Tú compra esta pendiente de pago!</Typography>
                <Typography variant='h6' component='h6'>Una vez que termines con el proceso de pago, empezaremos a preparar tu pedido.</Typography>
            </Grid>
        </Layout>
    )
}