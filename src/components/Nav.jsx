import { useState } from 'react'
import NextLink from 'next/link'
import SearchBar from './SearchBar'
import { AppBar, Toolbar, Grid, IconButton, Badge, Typography, Link, Menu, MenuItem } from '@mui/material'
import { Favorite, ShoppingCart, AccountCircle } from '@mui/icons-material'

export default function Nav() {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
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
                            <AccountCircle />
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
                        <MenuItem onClick={handleClose}>Registrarse</MenuItem>
                        <MenuItem onClick={handleClose}>Ingresar</MenuItem>
                        <MenuItem onClick={handleClose}>Perfil</MenuItem>
                        <MenuItem onClick={handleClose}>Administrar</MenuItem>
                        <MenuItem onClick={handleClose}>Salir</MenuItem>
                    </Menu>
                </Grid>
            </Grid>
        </Toolbar>
        </AppBar >
    )
}