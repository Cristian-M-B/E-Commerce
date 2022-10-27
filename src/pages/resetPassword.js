import { useState } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import connectionDB from '../utils/db'
import User from '../models/user'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Grid, Paper, Typography, TextField, Button } from '@mui/material'

const paperStyles = {
    padding: '15px',
    width: '33%',
    '@media(max-width: 600px)': {
        width: '92%'
    }
}

export default function Reset({ users }) {
    const [email, setEmail] = useState('')
    const [isValid, setIsValid] = useState(false)

    const validate = (email) => {
        return users?.some(user => user.email === email)
    }

    const handleChange = (e) => {
        setIsValid(validate(e.target.value))
        setEmail(e.target.value)
    }

    const handleSubmit = async () => {
        try {
            const { data } = await axios.put(`/api/user?reset=${true}`, { email })
            Swal.fire({
                icon: 'success',
                text: 'En unos minutos te llegará un email con tu nueva contraseña',
                confirmButtonText: 'Cerrar',
                timer: 5000,
            })
            setEmail('')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Layout>
            <Head>
                <title>E-Commerce | Resetear Contraseña</title>
            </Head>
            <Grid container justifyContent='center' alignItems='center' style={{ height: '75vh' }}>
                <Paper elevation={12} sx={paperStyles}>
                    <Typography variant='h6' component='h6' align='center'>Resetear Contraseña</Typography>
                    <TextField
                        fullWidth
                        required
                        variant='outlined'
                        label='E-mail'
                        value={email}
                        onChange={handleChange}
                        style={{ marginTop: '4vh' }}
                    />
                    <Button
                        fullWidth
                        variant='contained'
                        color='secondary'
                        size='large'
                        disabled={!isValid}
                        onClick={handleSubmit}
                        style={{ marginTop: '4vh', marginBottom: '2vh' }}
                    >
                        Enviar
                    </Button>
                </Paper>
            </Grid>
        </Layout>
    )
}

export async function getServerSideProps() {
    await connectionDB();
    const users = await User.find({}).lean()

    return {
        props: {
            users: JSON.parse(JSON.stringify(users))
        }
    }
}