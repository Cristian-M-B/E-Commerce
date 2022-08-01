import Head from 'next/head'
import NextLink from 'next/link'
import Layout from '../components/Layout'
import { useStore } from '../context/StoreProvider'
import { Grid, Paper, Stack, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Link } from '@mui/material'
import { Favorite, History, LocalShipping, Person } from '@mui/icons-material'

const paperStyles = {
    padding: '15px',
    width: '40%',
    '@media(max-width: 600px)': {
        width: '98%'
    }
}

export default function Profile() {
    const { userInfo } = useStore();

    return (
        <Layout>
            <Head>
                <title>E-Commerce | Perfil</title>
            </Head>
            <Grid container justifyContent='center' alignItems='center' style={{ minHeight: '80vh' }}>
                <Paper elevation={12} sx={paperStyles}>
                    <Typography variant='h6' component='h6' align='center'>¡Bienvenido a tu perfil!</Typography>
                    <Stack direction='row' style={{ marginTop: '4vh', marginBottom: '4vh' }}>
                        <img src={userInfo?.image} style={{ borderRadius: '50%', height: '100px', width: '100px', marginRight: '20px' }} />
                        <Stack direction='column' sx={{ justifyContent: 'center' }}>
                            <Typography>{userInfo?.firstName} {userInfo?.lastName}</Typography>
                            <Typography>{userInfo?.email}</Typography>
                        </Stack>
                    </Stack>
                    <List>
                        <NextLink href='/favorites' passHref>
                            <Link underline='none'>
                                <ListItem>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <Favorite />
                                        </ListItemIcon>
                                        <ListItemText primary='Favoritos' />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                        </NextLink>
                        <NextLink href='/' passHref>
                            <Link underline='none'>
                                <ListItem>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <History />
                                        </ListItemIcon>
                                        <ListItemText primary='Historial de Compras' />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                        </NextLink>
                        <NextLink href='/shippingData' passHref>
                            <Link underline='none'>
                                <ListItem>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <LocalShipping />
                                        </ListItemIcon>
                                        <ListItemText primary='Datos de Envio' />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                        </NextLink>
                        <NextLink href='/userData' passHref>
                            <Link underline='none'>
                                <ListItem>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <Person />
                                        </ListItemIcon>
                                        <ListItemText primary='Datos de Usuario' />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                        </NextLink>
                    </List>
                </Paper>
            </Grid>
        </Layout >
    )
}