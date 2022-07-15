import { useState } from 'react'
import NextLink from 'next/link'
import SearchBar from './SearchBar'
import { useStore, useDispatch } from '../context/StoreProvider'
import { actionsTypes } from '../context/StoreReducer'
import { AppBar, Toolbar, Grid, IconButton, Badge, Typography, Link, Menu, MenuItem, Avatar } from '@mui/material'
import { Favorite, ShoppingCart, AccountCircle } from '@mui/icons-material'

export default function Nav() {
    const [anchorEl, setAnchorEl] = useState(null);
    const { userInfo } = useStore();
    const dispatch = useDispatch();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    function logout() {
        handleClose();
        dispatch({type: actionsTypes.REMOVE_USER_INFO})
    }

    return (
        <AppBar position='static'>
            <Toolbar style={{ height: '8vh' }}>
                <Grid container direction='row' alignItems='center' justifyContent='space-between'>
                    <NextLink href='/' passHref>
                        <Link underline='none' color='inherit'>
                            <Typography>E-Commerce</Typography>
                        </Link>
                    </NextLink>
                    <SearchBar />
                    <Grid>
                        <IconButton color='inherit'>
                            <Badge badgeContent={5} color='secondary'>
                                <Favorite />
                            </Badge>
                        </IconButton>
                        <IconButton color='inherit'>
                            <Badge badgeContent={2} color='secondary'>
                                <ShoppingCart />
                            </Badge>
                        </IconButton>
                        <IconButton
                            color='inherit'
                            onClick={handleMenu}
                        >
                            {userInfo?.image 
                                ? <Avatar src={userInfo.image} />
                                : <AccountCircle />
                            }
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            {!userInfo?.firstName
                                ? <div>
                                    <MenuItem onClick={handleClose}>
                                        <NextLink href='/register' passHref>
                                            <Link underline='none'>
                                                Registrarse
                                            </Link>
                                        </NextLink>
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                        <NextLink href='/login' passHref>
                                            <Link underline='none'>
                                                Ingresar
                                            </Link>
                                        </NextLink>
                                    </MenuItem>
                                </div>
                                : <div>
                                    <MenuItem onClick={handleClose}>Perfil</MenuItem>
                                    {userInfo?.isAdmin && 
                                        <MenuItem onClick={handleClose}>Administrar</MenuItem>
                                    }
                                    <MenuItem onClick={logout}>Salir</MenuItem>
                                </div>
                            }
                        </Menu>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar >
    )
}