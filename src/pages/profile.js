import { useState } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import Layout from '../components/Layout'
import axios from 'axios'
import { useStore, useDispatch } from '../context/StoreProvider'
import { actionsTypes } from '../context/StoreReducer'
import { Grid, Paper, Stack, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Link, IconButton, Avatar, Modal, TextField, Button } from '@mui/material'
import Favorite from '@mui/icons-material/Favorite'
import History from '@mui/icons-material/History'
import LocalShipping from '@mui/icons-material/LocalShipping'
import Person from '@mui/icons-material/Person'
import AccountCircle from '@mui/icons-material/AccountCircle'
import Close from '@mui/icons-material/Close'

const paperStyles = {
    padding: '15px',
    paddingRight: '30px',
    width: 'auto'
}

const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '460px',
    minHeight: '250px',
    padding: '10px',
    '@media(max-width: 500px)': {
        width: '90%'
    }
}

const avatarStyles= {
    height: '90px', 
    width: '90px',
    '@media(max-width: 600px)': {
        width: '60px',
        height: '60px'
    }
}

const iconButtonStyles = {
    marginRight: '10px' ,
    '@media(max-width: 600px)': {
        marginRight: '5px' ,
    }
}

export default function Profile() {
    const { userInfo } = useStore();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState('');
    const [file, setFile] = useState('');

    function openModal() {
        setOpen(true);
    }

    function closeModal() {
        setOpen(false);
    }

    function validateUrl() {
        if (/^((http|https):\/\/)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]$/i.test(url)) {
            return true;
        } else {
            return false;
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (file) {
            if (file.type.includes('image')) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'lwgld9gf');
                const image = await axios.post('https://api.cloudinary.com/v1_1/ddouuo3xs/image/upload', formData);
                const newAvatar = await axios.put(`/api/user?user=${userInfo._id}&image=${true}`, { image: image.data.secure_url });
                dispatch({ type: actionsTypes.UPDATE_AVATAR, payload: newAvatar.data });
                setFile('');
                setUrl('');
                closeModal();
            } else {
                alert('Solamente son validos los archivos de tipo imagen')
            }
        } else if (url) {
            if (validateUrl()) {
                const newAvatar = await axios.put(`/api/user?user=${userInfo._id}&image=${true}`, { image: url });
                dispatch({ type: actionsTypes.UPDATE_AVATAR, payload: newAvatar.data });
                setUrl('');
                setFile('');
                closeModal();
            } else {
                alert('Ingresa una URL valida');
            }
        }
    }

    return (
        <Layout>
            <Head>
                <title>E-Commerce | Perfil</title>
            </Head>
            <Grid container justifyContent='center' alignItems='center' style={{ minHeight: '80vh' }}>
                <Paper elevation={12} sx={paperStyles}>
                    <Typography variant='h6' component='h6' align='center'>¡Bienvenido a tu perfil!</Typography>
                    <Stack direction='row' style={{ marginTop: '4vh', marginBottom: '4vh' }}>
                        {userInfo?.image
                            ? <IconButton onClick={openModal} sx={iconButtonStyles}>
                                <Avatar src={userInfo?.image} alt='Not Found' sx={avatarStyles} />
                            </IconButton>
                            : <IconButton onClick={openModal} sx={iconButtonStyles}>
                                <AccountCircle sx={avatarStyles} />
                            </IconButton>
                        }
                        <Modal
                            open={open}
                            onClose={closeModal}
                        >
                            <Paper sx={modalStyles}>
                                <Stack direction='row' sx={{ justifyContent: 'space-between', marginBottom: '20px' }}>
                                    <Typography variant='h6' component='h6' align='center' sx={{ width: '90%' }}>Añadir imagen de perfil</Typography>
                                    <IconButton onClick={closeModal}>
                                        <Close />
                                    </IconButton>
                                </Stack>
                                <Stack direction='column'>
                                    <Typography sx={{ marginBottom: '2px' }}>Opción 1: Imagen de Internet</Typography>
                                    <TextField
                                        fullWidth
                                        variant='outlined'
                                        placeholder='Copia aquí la URL'
                                        type='url'
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        sx={{ marginBottom: '10px' }}
                                    />
                                    <Typography sx={{ marginBottom: '10px' }}>Opción 2: Imagen en mi Equipo</Typography>
                                    <input
                                        type='file'
                                        accept='image/*'
                                        onChange={(e) => setFile(e.target.files[0])}
                                        style={{ marginBottom: '20px' }}
                                    />
                                    <Button
                                        variant='contained'
                                        size='large'
                                        color='secondary'
                                        disabled={Boolean(!url && !file)}
                                        onClick={handleSubmit}
                                    >
                                        Enviar
                                    </Button>
                                </Stack>
                            </Paper>
                        </Modal>
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
                        <NextLink href='/shoppingHistory' passHref>
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