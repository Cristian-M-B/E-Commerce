import { useState, useEffect } from 'react'
import NextLink from 'next/link'
import SearchBar from './SearchBar'
import axios from 'axios'
import { useStore, useDispatch } from '../context/StoreProvider'
import { actionsTypes } from '../context/StoreReducer'
import { AppBar, Toolbar, Grid, IconButton, Badge, Typography, Link, Menu, MenuItem, Avatar } from '@mui/material'
import { Favorite, ShoppingCart, AccountCircle } from '@mui/icons-material'

export default function Nav() {
    const [anchorEl, setAnchorEl] = useState(null);
    const { userInfo } = useStore();
    const { favorites, cart } = userInfo;
    const dispatch = useDispatch();

    useEffect(() => {
        !userInfo?.firstName && dispatch({type: actionsTypes.GET_USER_INFO_LOCAL_STORAGE})
        !userInfo?.firstName && dispatch({type: actionsTypes.GET_ORDER_LOCAL_STORAGE})
        getAllProducts()
    }, [])

    async function getAllProducts(){
        const products = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/products`)
        dispatch({type: actionsTypes.LOAD_PRODUCTS, payload: products.data})
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    function logout() {
        handleClose();
        dispatch({ type: actionsTypes.REMOVE_USER_INFO })
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
                            <NextLink href='/favorites' passHref>
                                <Link>
                                    <Badge badgeContent={favorites?.length} color='secondary'>
                                        <Favorite sx={{ color: 'white' }} />
                                    </Badge>
                                </Link>
                            </NextLink>
                        </IconButton>
                        <IconButton color='inherit'>
                            <NextLink href='/cart' passHref>
                                <Link>
                                    <Badge badgeContent={cart?.length} color='secondary'>
                                        <ShoppingCart sx={{ color: 'white' }} />
                                    </Badge>
                                </Link>
                            </NextLink>
                        </IconButton>
                        <IconButton
                            color='inherit'
                            onClick={handleMenu}
                        >
                            {userInfo?.image
                                ? <Avatar src={userInfo.image} />
                                : <AccountCircle sx={{ marginTop: '1vh' }} />
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
                                    <MenuItem onClick={handleClose}>
                                        <NextLink href='/profile' passHref>
                                            <Link underline='none'>
                                                Perfil
                                            </Link>
                                        </NextLink>
                                    </MenuItem>

                                    {userInfo?.isAdmin &&
                                        <MenuItem onClick={handleClose}>
                                            <NextLink href='/admin' passHref>
                                                <Link underline='none'>
                                                    Administrar
                                                </Link>
                                            </NextLink>
                                        </MenuItem>
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