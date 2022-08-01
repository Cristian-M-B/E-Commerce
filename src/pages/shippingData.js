import Head from 'next/head'
import Layout from '../components/Layout'
import ShippingDataForm from '../components/ShippingDataForm'
import { Grid } from '@mui/material'

export default function ShippingData() {
    return (
        <Layout>
            <Head>
                <title>E-Commerce | Datos de Envio</title>
            </Head>
            <Grid
                container
                justifyContent='center'
                alignItems='center'
                style={{ minHeight: '75vh' }}
            >
                <ShippingDataForm />
            </Grid>
        </Layout>
    )
}