import { useState } from 'react'
import NextLink from 'next/link'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useStore, useDispatch } from '../context/StoreProvider'
import { actionsTypes } from '../context/StoreReducer'
import { parseCurrency } from '../utils/functions'
import { WhatsappShareButton, WhatsappIcon } from 'react-share'
import { Card, CardContent, CardActions, CardActionArea, IconButton, Link, Grid, Typography } from '@mui/material'
import Favorite from '@mui/icons-material/Favorite'
import Share from '@mui/icons-material/Share'
import ShoppingCart from '@mui/icons-material/ShoppingCart'

export default function ProductCard({ product }) {
    const { userInfo } = useStore();
    const { favorites, cart } = userInfo;
    const dispatch = useDispatch();
    const [share, setShare] = useState(false);
    let isFavorite = false;
    let isCart = false;

    function handleClick() {
        setShare(!share);
    }

    async function updateFavorite() {
        if (userInfo?.firstName) {
            if (favorites?.some(favoriteProduct => favoriteProduct._id === product._id)) {
                try {
                    const res = await axios.delete(`/api/user?user=${userInfo._id}&favorite=${product._id}`)
                    dispatch({ type: actionsTypes.UPDATE_FAVORITE, payload: res.data })
                } catch (error) {
                    alert(error)
                }
            } else {
                try {
                    const res = await axios.post(`/api/user?user=${userInfo._id}&favorite=${product._id}`)
                    dispatch({ type: actionsTypes.UPDATE_FAVORITE, payload: res.data })
                } catch (error) {
                    alert(error)
                }
            }
        } else {
            Swal.fire({
                icon: 'info',
                text: 'Debes iniciar sesión o registrarte para poder seleccionar tus productos favoritos.',
                confirmButtonText: 'Cerrar',
                timer: 5000,
            })
        }
    }

    async function updateCart() {
        if (userInfo?.firstName) {
            if (cart?.some(cartProduct => cartProduct._id._id === product._id)) {
                try {
                    const res = await axios.delete(`/api/user?user=${userInfo._id}&cart=${product._id}`)
                    dispatch({ type: actionsTypes.UPDATE_CART, payload: res.data })
                } catch (error) {
                    alert(error)
                }
            } else {
                try {
                    const res = await axios.post(`/api/user?user=${userInfo._id}&cart=${product._id}`)
                    dispatch({ type: actionsTypes.UPDATE_CART, payload: res.data })
                } catch (error) {
                    alert(error)
                }
            }
        } else {
            Swal.fire({
                icon: 'info',
                text: 'Debes iniciar sesión o registrarte para poder gestionar tu carrito.',
                confirmButtonText: 'Cerrar',
                timer: 5000,
            })
        }
    }

    return (
        <Card style={{ width: '250px', margin: '10px' }}>
            <NextLink href={`/product/${product._id}`} passHref>
                <Link underline='none'>
                    <CardActionArea>
                        <Typography
                            align='center'
                            noWrap={true}
                            variant='h6'
                            component='h6'
                            sx={{ margin: '10px auto' }}
                        >
                            {product.name}
                        </Typography>
                        <Grid container justifyContent='center'>
                            <img
                                src={product.images[0]}
                                alt='Not Found'
                                height='150'
                            />
                        </Grid>
                        <CardContent>
                            <Grid container justifyContent='space-between'>
                                <Typography>{parseCurrency(product.price)}</Typography>
                                {product.stock < 1 &&
                                    <Typography color='error'>Sin Stock</Typography>
                                }
                            </Grid>
                        </CardContent>
                    </CardActionArea>
                </Link>
            </NextLink>
            {isFavorite = favorites?.some(favoriteProduct => favoriteProduct._id === product._id)}
            {isCart = cart?.some(cartProduct => cartProduct._id._id === product._id)}
            <CardActions>
                <Grid container justifyContent='space-around'>
                    <IconButton onClick={updateFavorite}>
                        <Favorite sx={{ color: isFavorite && '#ffa533' }} />
                    </IconButton>
                    {share &&
                        <WhatsappShareButton
                            title='¡Mirá lo bueno que está esto!'
                            url={`tecnocommerce.vercel.app/product/${product._id}`}
                        >
                            <WhatsappIcon size={22} round={true} style={{ marginTop: '1vh' }} />
                        </WhatsappShareButton>
                    }
                    <IconButton onClick={handleClick}>
                        <Share />
                    </IconButton>
                    <IconButton disabled={Boolean(product.stock < 1)} onClick={updateCart}>
                        <ShoppingCart sx={{ color: isCart && '#ffa533' }} />
                    </IconButton>
                </Grid>
            </CardActions>
        </Card>
    )
}