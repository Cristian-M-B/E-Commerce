import Head from 'next/head'
import Layout from '../components/Layout'
import axios from 'axios'
import { useStore, useDispatch } from '../context/StoreProvider'
import { actionsTypes } from '../context/StoreReducer'
import { parseCurrency } from '../utils/functions'
import { Grid, Stack, Paper, Typography, Button, IconButton } from '@mui/material'
import { ArrowLeft, ArrowRight, Delete } from '@mui/icons-material'

const itemsStyles = {
    width: '70%',
    '@media(max-width: 600px)': {
        width: '100%'
    }
}

const paperStyles = {
    height: '90px',
    padding: '5px',
    marginBottom: '1vh', 
    marginRight: '2vw',
    '@media(max-width: 600px)' : {
        marginRight: '0vw'
    }
}

const nameStyles = {
    width: '35%', 
    '@media(max-width: 600px)': {
        display:'none'
    }
}

const quantityStyles = {
    '@media(max-width: 600px)': {
        display:'none'
    }
}

const optionsStyles = {
    width: '20%', 
    '@media(max-width: 600px)': {
        width: '75%',
        marginTop: '3vh'
    }
}

export default function Cart() {
    const { userInfo } = useStore();
    let { cart } = userInfo;
    const dispatch = useDispatch();

    async function more(product) {
        if (product.quantity < product._id.stock) {
            const updateCart = cart?.map(item => {
                if (item._id._id === product._id._id) {
                    item.quantity++;
                }
                return item;
            })
            const res = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/user?user=${userInfo._id}&cart=${true}`, updateCart)
            dispatch({ type: actionsTypes.UPDATE_CART, payload: res.data })
        }
    }

    async function less(product) {
        if (product.quantity > 1) {
            const updateCart = cart?.map(item => {
                if (item._id._id === product._id._id) {
                    item.quantity--;
                }
                return item;
            })
            const res = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/user?user=${userInfo._id}&cart=${true}`, updateCart)
            dispatch({ type: actionsTypes.UPDATE_CART, payload: res.data })
        }
    }

    async function remove(product) {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/user?user=${userInfo._id}&cart=${product._id._id}`)
        dispatch({ type: actionsTypes.UPDATE_CART, payload: res.data })
    }

    async function empty() {
        const res = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/user?user=${userInfo._id}&emptyCart=${true}`)
        dispatch({ type: actionsTypes.UPDATE_CART, payload: res.data })
    }

    if (!cart?.length) {
        return (
            <Layout>
                <Head>
                    <title>E-Commerce | Carrito</title>
                </Head>
                <Grid container direction='column' justifyContent='center' alignItems='center' style={{ height: '75vh' }}>
                    <Typography variant='h5' component='h5'>¡El carrito está vacio!</Typography>
                    <Typography variant='h6' component='h6'>Podes agregar un producto haciendo click en el carrito.</Typography>
                </Grid>
            </Layout>
        )
    }

    return (
        <Layout>
            <Head>
                <title>E-Commerce | Carrito</title>
            </Head>
            <div style={{ minHeight: '75vh' }}>
                <Typography variant='h5' component='h5' align='center' style={{ marginBottom: '5vh' }}>Mi Carrito</Typography>
                <Grid container justifyContent='center'>
                    <Stack direction='column' sx={itemsStyles}>
                        {cart?.map(product => (
                            <Paper elevation={1} sx={paperStyles} key={product._id._id}>
                                <Stack direction='row' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <img src={product._id?.images[0]} height='80' width='80' />
                                    <Typography variant='h6' component='h6' align='center' sx={nameStyles}>{product._id?.name}</Typography>
                                    <Stack direction='column' sx={quantityStyles}>
                                        <Typography>Precio Unitario</Typography>
                                        <Typography align='center'>{parseCurrency(product._id.price)}</Typography>
                                    </Stack>
                                    <Stack direction='column'>
                                        <Typography>Cantidad</Typography>
                                        <Typography align='center'>{<IconButton disabled={Boolean(product.quantity <= 1)} onClick={() => less(product)} style={{ height: '0px', width: '0px' }}><ArrowLeft /></IconButton>}{product.quantity}{<IconButton disabled={Boolean(product.quantity >= product._id.stock)} onClick={() => more(product)} style={{ height: '0px', width: '0px' }}><ArrowRight /></IconButton>}</Typography>
                                    </Stack>
                                    <Stack direction='column'>
                                        <Typography align='center'>SubTotal</Typography>
                                        <Typography>{parseCurrency(product._id.price * product.quantity)}</Typography>
                                    </Stack>
                                    <IconButton onClick={() => remove(product)}><Delete /></IconButton>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                    <Stack direction='column' sx={optionsStyles}>
                        <Paper elevation={1} style={{ height: '150px', backgroundColor: '#ffa533', marginBottom: '3vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant='h6' component='h6'>Total</Typography>
                            <Typography variant='h6' component='h6'>{parseCurrency(cart?.reduce((acc, product) => acc += (product._id.price * product.quantity), 0))}</Typography>
                        </Paper>
                        <Button variant='contained' color='primary' style={{ marginBottom: '1vh' }}>Comprar</Button>
                        <Button variant='contained' color='primary' onClick={empty} style={{ marginTop: '1vh' }}>Vaciar</Button>
                    </Stack>
                </Grid>
            </div>
        </Layout>
    )
}