import { useState, useEffect } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import axios from 'axios'
import { useDispatch } from '../context/StoreProvider'
import { actionsTypes } from '../context/StoreReducer'
import { Grid, Paper, Typography, TextField, InputAdornment, IconButton, Button, Link } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const paperStyles = {
    padding: '15px',
    width: '33%',
    '@media(max-width: 600px)': {
        width: '92%'
    }
}

export default function Register() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [visibility, setVisibility] = useState(false);
    const [error, setError] = useState({});
    const [users, setUsers] = useState();
    const [dataForm, setDataForm] = useState({
        firstName: '',
        lastName: '',
        document: '',
        email: '',
        password: ''
    })

    useEffect(() => {
        getUsers();
    }, [])

    async function getUsers() {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/user`)
        setUsers(response.data)
    }

    function validate(data) {
        let error = {}

        if (!data.lastName) {
            error.lastName = 'El apellido es requerido'
        } else if (!/^[a-z '`]{1,}$/i.test(data.lastName)) {
            error.lastName = 'Debe ingresar un formato de apellido válido'
        } else if (data.lastName.length < 3) {
            error.lastName = 'El apellido debe tener un minimo de 3 caracteres'
        }

        if (!data.firstName) {
            error.firstName = 'El nombre es requerido'
        } else if (!/^[a-z '`]{1,}$/i.test(data.firstName)) {
            error.firstName = 'Debe ingresar un formato de nombre válido'
        } else if (data.firstName.length < 3) {
            error.firstName = 'El nombre debe tener un minimo de 3 caracteres'
        }

        if (!data.document) {
            error.document = 'El número de documento es requerido'
        } else if (!/^[0-9]{1,}$/i.test(data.document)) {
            error.document = 'Debe ingresar un formato de documento válido (sin puntos)'
        } else if (data.document.length < 7 || data.document.length > 8) {
            error.document = 'El número de documento debe tener 7 u 8 dígitos'
        } else if (validateDocument(data.document)) {
            error.document = 'Ya hay un usuario registrado con este número de documento'
        }

        if (!data.email) {
            error.email = 'El email es requerido'
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
            error.email = 'Debe ingresar un formato de email válido'
        } else if (validateEmail(data.email)) {
            error.email = 'Ya hay un usuario registrado con este email'
        }

        if (!data.password) {
            error.password = 'La contraseña es requerida'
        } else if (!/^(?=.*\d)(?=.*[\u0021-\u002b-\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,16}$/i.test(data.password)) {
            error.password = 'La contraseña debe tener entre 8 y 16 caracteres y contar con letras, números y caracteres especiales'
        }

        return error
    }

    function validateDocument(document) {
        return users.some(user => user.document === document)
    }

    function validateEmail(email) {
        return users.some(user => user.email === email)
    }

    function handleChange(e) {
        setError(validate({
            ...dataForm,
            [e.target.name]: e.target.value
        }))
        setDataForm({
            ...dataForm,
            [e.target.name]: e.target.value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const newUser = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/user`, dataForm)
            dispatch({ type: actionsTypes.LOAD_USER_INFO, payload: newUser.data })
            setDataForm({
                firstName: '',
                lastName: '',
                document: '',
                email: '',
                password: ''
            })
            router.push('/')
        } catch (error) {
            alert(error)
        }
    }

    return (
        <Layout>
            <Head>
                <title>E-Commerce | Registrarse</title>
            </Head>
            <Grid container justifyContent='center' alignItems='center' style={{ minHeight: '80vh' }}>
                <Paper elevation={12} sx={paperStyles}>
                    <Typography variant='h6' component='h6' align='center'>Registrarse</Typography>
                    <TextField
                        fullWidth
                        required
                        variant='outlined'
                        label='Apellido/s'
                        name='lastName'
                        value={dataForm.lastName}
                        onChange={handleChange}
                        helperText={error.lastName}
                        style={{ marginTop: '4vh' }}
                    />
                    <TextField
                        fullWidth
                        required
                        variant='outlined'
                        label='Nombre/s'
                        name='firstName'
                        value={dataForm.firstName}
                        onChange={handleChange}
                        helperText={error.firstName}
                        style={{ marginTop: '2vh' }}
                    />
                    <TextField
                        fullWidth
                        required
                        variant='outlined'
                        label='N° de Documento'
                        name='document'
                        value={dataForm.document}
                        onChange={handleChange}
                        helperText={error.document}
                        style={{ marginTop: '2vh' }}
                    />
                    <TextField
                        fullWidth
                        required
                        variant='outlined'
                        label='E-mail'
                        name='email'
                        value={dataForm.email}
                        onChange={handleChange}
                        helperText={error.email}
                        style={{ marginTop: '2vh' }}
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
                        helperText={error.password}
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
                        disabled={Boolean(!dataForm.lastName || !dataForm.firstName || !dataForm.document || !dataForm.email || !dataForm.password || error.lastName || error.firstName || error.document || error.email || error.password)}
                        onClick={handleSubmit}
                        style={{ marginTop: '4vh', marginBottom: '2vh' }}
                    >
                        Enviar
                    </Button>
                    <Typography>
                        ¿Ya estás registrado? {
                            <NextLink href='/login' passHref>
                                <Link underline='none'>
                                    Inicia sesión
                                </Link>
                            </NextLink>
                        }
                    </Typography>
                </Paper>
            </Grid>
        </Layout>
    )
}