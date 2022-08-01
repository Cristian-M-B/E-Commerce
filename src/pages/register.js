import Head from 'next/head'
import Layout from '../components/Layout'
import UserDataForm from '../components/UserDataForm'
import { Grid } from '@mui/material'

export default function Register() {
    return (
        <Layout>
            <Head>
                <title>E-Commerce | Registrarse</title>
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