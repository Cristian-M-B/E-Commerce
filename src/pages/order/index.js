import { useState } from 'react'
import Head from 'next/head'
import axios from 'axios'
import Layout from '../../components/Layout'
import ShippingDataForm from '../../components/ShippingDataForm'
import { useStore, useDispatch } from '../../context/StoreProvider'
import { actionsTypes } from '../../context/StoreReducer'
import { parseCurrency } from '../../utils/functions'
import { Grid, Stack, Paper, Typography, Checkbox, Button } from '@mui/material'

const optionsStyles = {
    width: '45%',
    marginRight: '2vw',
    marginBottom: '5vh',
    '@media(max-width: 600px)': {
        width: '60%'
    }
}

const totalStyles = {
    width: '20%',
    '@media(max-width: 600px)': {
        width: '35%'
    }
}

const checkboxStyles = {
    marginLeft: '5px',
    marginRight: '5px',
    '@media (max-width: 600px)': {
        marginLeft: '3px',
        marginRight: '3px',
    }
}

export default function Order() {
    const { userInfo } = useStore();
    const { shippingData, cart } = userInfo;
    const dispatch = useDispatch();
    const [checkedOptionOne, setCheckedOptionOne] = useState(false);
    const [checkedOptionTwo, setCheckedOptionTwo] = useState(false);

    function handleChangeOptionOne(event) {
        if (event.target.checked) {
            setCheckedOptionTwo(false);
        }
        setCheckedOptionOne(event.target.checked);
    }

    function handleChangeOptionTwo(event) {
        if (event.target.checked) {
            setCheckedOptionOne(false);
        }
        setCheckedOptionTwo(event.target.checked);
    }

    async function sendOrder() {
        const userID = userInfo?._id;
        const products = cart?.map(product => {
            return {
                id: product._id._id,
                name: product._id.name,
                images: [product._id.images[0]],
                price: product._id.price,
                quantity: product.quantity
            }
        })
        const deliveryMode = checkedOptionOne ? 'Retira en el local' : 'Enviar al domicilio'
        const shipment = checkedOptionTwo ? 1000 : 0
        dispatch({ type: actionsTypes.LOAD_ORDER, payload: { userID, products, deliveryMode } })
        const { data } = await axios.post(`/api/mp`, { cart, shipment, userInfo })
        const mp = new MercadoPago(process.env.NEXT_PUBLIC_KEY_MP, {
            locale: 'es-AR'
        })
        mp.checkout({
            preference: {
                id: data
            },
            autoOpen: true
        })
    }

    return (
        <Layout>
            <Head>
                <title>E-Commerce | Orden de Compra</title>
            </Head>
            <div style={{ minHeight: '75vh' }}>
                <Typography variant='h5' component='h5' align='center' style={{ marginBottom: '4vh' }}>Orden de Compra</Typography>
                <Grid container justifyContent='center'>
                    <Stack direction='column' sx={optionsStyles}>
                        <Paper elevation={1} style={{ height: '85px', padding: '5px', marginBottom: '2vh', display: 'flex', alignItems: 'center' }}>
                            <Checkbox
                                checked={checkedOptionOne}
                                onChange={handleChangeOptionOne}
                                sx={checkboxStyles}
                            />
                            <Typography>
                                Retiro en el local
                            </Typography>
                        </Paper>
                        <Paper elevation={1} style={{ height: '85px', padding: '5px', display: 'flex', alignItems: 'center' }}>
                            <Checkbox
                                checked={checkedOptionTwo}
                                onChange={handleChangeOptionTwo}
                                sx={checkboxStyles}
                            />
                            <Typography>
                                Enviar a mi domicilio
                            </Typography>
                        </Paper>
                    </Stack>
                    <Stack direction='column' sx={totalStyles}>
                        <Paper elevation={1} style={{ height: '130px', backgroundColor: '#ffa533', marginBottom: '2.7vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant='h6' component='h6'>Total</Typography>
                            <Typography variant='h6' component='h6'>{parseCurrency(cart?.reduce((acc, product) => acc += (product._id.price * product.quantity), 0))}</Typography>
                        </Paper>
                        <Button variant='contained' color='primary' disabled={Boolean((!checkedOptionOne && !checkedOptionTwo) || (checkedOptionTwo && !shippingData?.address))} onClick={sendOrder}>
                            Pagar
                        </Button>
                    </Stack>
                    {checkedOptionOne &&
                        <>
                            <Stack direction='column' sx={{ width: '65%', '@media(max-width: 600px)': { width: '95%' } }}>
                                <Typography>A partir del viernes podrás retirar tu compra en nuestro local presentando tu DNI.</Typography>
                                <Typography>Además te recordamos que nos encontramos en Av. Balbin 2109 - San Miguel y que nuestro horario de atención es de viernes a domingos y feriados de 10:00 a 22:00 hs.</Typography>
                                <Typography>Te dejamos este mapa con nuestra ubicación para que te sea más facil encontrarnos.</Typography>
                                <iframe src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3286.156865586528!2d-58.72175118544368!3d-34.54958346214139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcbd7408f4a06d%3A0x8908a4ee024e45c7!2sFeria%20Persa!5e0!3m2!1ses!2sar!4v1659212350007!5m2!1ses!2sar' loading='lazy' style={{ width: '100%', height: '400px', marginTop: '3vh' }}></iframe>
                            </Stack>
                        </>
                    }
                    {checkedOptionTwo && !shippingData?.address &&
                        <ShippingDataForm />
                    }
                    {checkedOptionTwo && shippingData?.address &&
                        <Stack direction='column'>
                            <Typography>Te recordamos que el envio a domicilio tiene un costo adicional dependiendo de las zonas abajo mencionadas.</Typography>
                            <Typography>En tu caso, el costo del envio es de $1.000,00.</Typography>
                        </Stack>
                    }
                </Grid>
            </div>
        </Layout>
    )
}