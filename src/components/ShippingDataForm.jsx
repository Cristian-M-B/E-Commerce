import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useStore, useDispatch } from '../context/StoreProvider'
import { actionsTypes } from '../context/StoreReducer'
import { Paper, Typography, TextField, Button } from '@mui/material'

const paperStyles = {
    padding: '15px',
    width: '33%',
    '@media(max-width: 600px)': {
        width: '92%'
    }
}

export default function ShippingDataForm() {
    const { userInfo } = useStore();
    const { shippingData } = userInfo;
    const dispatch = useDispatch();
    const router = useRouter();
    const [input, setInput] = useState({
        address: shippingData?.address,
        number: shippingData?.number,
        floor: shippingData?.floor,
        department: shippingData?.department,
        locality: shippingData?.locality,
        postalCode: shippingData?.postalCode
    })

    function handleChange(e) {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const res = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/user?user=${userInfo._id}&shippingData=${true}`, input)
        dispatch({ type: actionsTypes.UPDATE_SHIPPING_DATA, payload: res.data })
    }

    return (
        <Paper elevation={12} sx={paperStyles}>
            <Typography variant='h6' component='h6' align='center'>Datos de Envio</Typography>
            <TextField
                fullWidth
                required
                variant='outlined'
                label='Dirección'
                name='address'
                value={input.address}
                onChange={handleChange}
                style={{ marginTop: '4vh' }}
            />
            <TextField
                fullWidth
                required
                variant='outlined'
                label='Número'
                name='number'
                value={input.number}
                onChange={handleChange}
                style={{ marginTop: '2vh' }}
            />
            <TextField
                fullWidth
                variant='outlined'
                label='Piso'
                name='floor'
                value={input.floor}
                onChange={handleChange}
                style={{ marginTop: '2vh' }}
            />
            <TextField
                fullWidth
                variant='outlined'
                label='Departamento'
                name='department'
                value={input.department}
                onChange={handleChange}
                style={{ marginTop: '2vh' }}
            />
            <TextField
                fullWidth
                required
                variant='outlined'
                label='Localidad'
                name='locality'
                value={input.locality}
                onChange={handleChange}
                style={{ marginTop: '2vh' }}
            />
            <TextField
                fullWidth
                required
                variant='outlined'
                label='Código Postal'
                name='postalCode'
                value={input.postalCode}
                onChange={handleChange}
                style={{ marginTop: '2vh' }}
            />
            <Button
                fullWidth
                variant='contained'
                color='secondary'
                size='large'
                disabled={Boolean(!input.address || !input.number || !input.locality || !input.postalCode)}
                onClick={handleSubmit}
                style={{ marginTop: '4vh' }}
            >
                {shippingData?.address ? 'Editar' : 'Enviar'}
            </Button>
            {shippingData?.address &&
                <Button
                    fullWidth
                    variant='contained'
                    color='secondary'
                    size='large'
                    onClick={() => router.back()}
                    style={{ marginTop: '2vh', marginBottom: '2vh' }}
                >
                    Volver atrás
                </Button>
            }
        </Paper>
    )
}