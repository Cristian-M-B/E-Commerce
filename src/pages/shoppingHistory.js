import Head from 'next/head'
import Layout from '../components/Layout'
import connectionDB from '../utils/db'
import Order from '../models/order'
import { useStore } from '../context/StoreProvider'
import { parseCurrency, paymentStatus, paymentStatusColor } from '../utils/functions'
import { Grid, Paper, Stack, Typography } from '@mui/material'

const paperStyles = {
    width: '40%',
    marginBottom: '2vh',
    padding: '5px',
    '@media(max-width: 600px)': {
        width: '96%'
    }
}

export default function ShoppingHistory({ orders }) {
    const { userInfo } = useStore();
    const myOrders = orders?.filter(order => order.user?._id === userInfo?._id).reverse();

    return (
        <Layout>
            <Head>
                <title>E-Commerce | Historial de Compras</title>
            </Head>
            <Grid container direction='column' alignItems='center' style={{ minHeight: '75vh' }}>
                <Typography variant='h5' component='h5' style={{ marginBottom: '4vh' }}>Historal de Compras</Typography>
                {myOrders?.map(order => (
                    <Paper key={order._id} elevation={1} sx={paperStyles}>
                        <Stack direction='row' sx={{ justifyContent: 'space-around' }}>
                            <Typography>{order.date}</Typography>
                            <Typography color={paymentStatusColor(order.paymentStatus)} sx={{ fontWeight: 'bold' }}>
                                {paymentStatus(order.paymentStatus)}
                            </Typography>
                        </Stack>
                        {order?.products?.map(product => (
                            <Stack key={product._id} direction='row' sx={{ alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                                <img src={product.images[0]} alt='Not Found' width='80' height='80' />
                                <Typography align='center'>{product.name}</Typography>
                                <Typography style={{ marginRight: '10px' }}>{parseCurrency(product.price * product.quantity)}</Typography>
                            </Stack>
                        ))}
                    </Paper>
                ))}
            </Grid>
        </Layout>
    )
}

export async function getServerSideProps() {
    await connectionDB();
    const orders = await Order.find({}).populate('user').lean();

    return {
        props: {
            orders: JSON.parse(JSON.stringify(orders))
        }
    }
}