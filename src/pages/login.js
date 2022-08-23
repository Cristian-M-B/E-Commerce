import { useState } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import axios from 'axios'
import { useDispatch } from '../context/StoreProvider'
import { actionsTypes } from '../context/StoreReducer'
import { Grid, Paper, Typography, TextField, InputAdornment, IconButton, Button, Link } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Swal from 'sweetalert2'

const paperStyles = {
    padding: '15px',
    width: '33%',
    '@media(max-width: 600px)': {
        width: '92%'
    }
}

export default function Login() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [visibility, setVisibility] = useState(false);
    const [dataForm, setDataForm] = useState({
        email: '',
        password: ''
    })

    function handleChange(e) {
        setDataForm({
            ...dataForm,
            [e.target.name]: e.target.value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const user = await axios.post(`/api/user?login=true`, dataForm)
            if(!user.data) {
                Swal.fire({
                    icon: 'error',
                    title: 'Email o Contraseña incorrecto',
                    text: 'Intente nuevamente',
                    confirmButtonText: 'Cerrar',
                    timer: 5000,
                })
            } else {
                dispatch({type: actionsTypes.LOAD_USER_INFO, payload: user.data})
                setDataForm({
                    email: '',
                    password: ''
                })
                router.push('/')
            }
        } catch (error) {
            alert(error)
        }
    }

    return (
        <Layout>
            <Head>
                <title>E-Commerce | Ingresar</title>
            </Head>
            <Grid container justifyContent='center' alignItems='center' style={{ height: '75vh' }}>
                <Paper elevation={12} sx={paperStyles}>
                    <Typography variant='h6' component='h6' align='center'>Iniciar Sesión</Typography>
                    <TextField
                        fullWidth
                        required
                        variant='outlined'
                        label='E-mail'
                        name='email'
                        value={dataForm.email}
                        onChange={handleChange}
                        style={{ marginTop: '4vh' }}
                    />
                    <TextField
                        fullWidth
                        required
                        variant='outlined'
                        label='Contraseña'
                        name='password'
                        type={visibility ? 'text' : 'password'}
                        value={dataForm.password}
                        onChange={handleChange}
                        style={{ marginTop: '2vh' }}
                        InputProps={{
                            endAdornment:
                                <InputAdornment position='end'>
                                    <IconButton color='primary' onClick={() => setVisibility(!visibility)}>
                                        {visibility
                                            ? <VisibilityOff />
                                            : <Visibility />
                                        }
                                    </IconButton>
                                </InputAdornment>
                        }}
                    />
                    <Button
                        fullWidth
                        variant='contained'
                        color='secondary'
                        size='large'
                        disabled={Boolean(!dataForm.email || !dataForm.password)}
                        onClick={handleSubmit}
                        style={{ marginTop: '4vh', marginBottom: '2vh' }}
                    >
                        Enviar
                    </Button>
                    <Typography>
                        ¿Todavía no te registraste? {
                            <NextLink href='/register' passHref>
                                <Link underline='none'>
                                    Hazlo aquí
                                </Link>
                            </NextLink>
                        }
                    </Typography>
                </Paper>
            </Grid>
        </Layout>
    )
}