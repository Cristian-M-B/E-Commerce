import { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '../../components/Layout'
import axios from 'axios'
import { useStore, useDispatch } from '../../context/StoreProvider'
import { actionsTypes } from '../../context/StoreReducer'
import { Grid, Typography, CircularProgress } from '@mui/material'

export default function Pending({ query }) {
    const [loading, setLoading] = useState(true);
    const { userInfo, order } = useStore();
    const { userID, products, deliveryMode } = order;
    const dispatch = useDispatch();
    const currentDate = new Date().toLocaleString();
    const mp = {
        preferenceID: query.preference_id,
        paymentType: query.payment_type,
        paymentID: query.payment_id,
        paymentStatus: query.status
    }

    useEffect(() => {
        userID && newOrder()
    }, [userID])

    async function newOrder() {
        const order = await axios.post(`/api/order`, { userID, products, mp, currentDate, deliveryMode })
        const { data } = await axios.delete(`/api/user?user=${userInfo?._id}&emptyCart=${true}`)
        dispatch({ type: actionsTypes.UPDATE_CART, payload: data })
        await Promise.all(products.map(async (product) => (
            await axios.put(`/api/products?id=${product.id}&subtractStock=${true}`, { subtractStock: product.quantity })
        )))
        setLoading(false)
    }
    return (
        <Layout>
            <Head>
                <title>E-Commerce | Pago Pendiente</title>
            </Head>
            <Grid container direction='column' justifyContent='center' alignItems='center' style={{ minHeight: '75vh' }}>
                {loading
                    ? <>
                        <Typography variant='h5' component='h5'>¡Estamos procesando tu compra!</Typography>
                        <Typography variant='h6' component='h6'>Por favor, aguarda un momento.</Typography>
                        <CircularProgress color='primary' sx={{ marginTop: '5vh' }} />
                    </>
                    : <>
                        <img src='/warning.png' width='100' height='100' style={{ marginBottom: '50px' }} />
                        <Typography variant='h5' component='h5' align='center'>¡Tú compra esta pendiente de pago!</Typography>
                        <Typography variant='h6' component='h6' align='center'>Una vez que termines con el proceso de pago, empezaremos a preparar tu pedido.</Typography>
                        <Typography variant='h6' component='h6' style={{ marginTop: '4vh' }}>¡Muchas gracias por elegirnos!</Typography>
                    </>
                }
            </Grid>
        </Layout>
    )
}

export async function getServerSideProps({ query }) {
    return {
        props: {
            query
        }
    }
}