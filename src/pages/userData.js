import Head from 'next/head'
import Layout from '../components/Layout'
import UserDataForm from '../components/UserDataForm'
import { Grid } from '@mui/material'

export default function ShippingData() {
    return (
        <Layout>
            <Head>
                <title>E-Commerce | Datos de Usuario</title>
            </Head>
            <Grid
                container
                justifyContent='center'
                alignItems='center'
                style={{ minHeight: '75vh' }}
            >
                <UserDataForm />
            </Grid>
        </Layout>
    )
}