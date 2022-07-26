import { useState } from 'react'
import NextLink from 'next/link'
import axios from 'axios'
import { useStore, useDispatch } from '../context/StoreProvider'
import { actionsTypes } from '../context/StoreReducer'
import { WhatsappShareButton, WhatsappIcon } from 'react-share'
import { Card, CardContent, CardActions, CardActionArea, IconButton, Link, Grid, Typography } from '@mui/material'
import { Favorite, Share, ShoppingCart } from '@mui/icons-material'

export default function ProductCard({ product }) {
    const { userInfo } = useStore();
    const { favorites } = userInfo;
    const dispatch = useDispatch();
    const [share, setShare] = useState(false);
    let isFavorite = false;
    
    function handleClick() {
        setShare(!share);
    }

    async function updateFavorite() {
        if (userInfo?.firstName) {
            if (favorites?.some(favoriteProduct => favoriteProduct._id === product._id)) {
                try{
                    const res = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/user?user=${userInfo._id}&favorite=${product._id}`)
                    dispatch({type: actionsTypes.UPDATE_FAVORITE, payload: res.data})
                } catch (error) {
                    alert(error)
                }
            } else {
                try {
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/user?user=${userInfo._id}&favorite=${product._id}`)
                    dispatch({type: actionsTypes.UPDATE_FAVORITE, payload: res.data})
                } catch(error) {
                    alert(error)
                }
            }
        }
    }

    return (
        <Card style={{ width: '200px', margin: '10px' }}>
            <NextLink href={`/product/${product._id}`} passHref>
                <Link underline='none'>
                    <CardActionArea>
                        <Typography
                            align='center'
                            noWrap={true}
                            variant='h5'
                            component='h5'
                        >
                            {product.name}
                        </Typography>
                        <Grid container justifyContent='center'>
                            <img
                                src={product.images[0]}
                                height='150'
                            />
                        </Grid>
                        <CardContent>
                            {product.description}
                        </CardContent>
                    </CardActionArea>
                </Link>
            </NextLink>
            {isFavorite = favorites?.some(favoriteProduct => favoriteProduct._id === product._id)}
            <CardActions>
                <Grid container justifyContent='space-around'>
                    <IconButton onClick={updateFavorite}>
                        <Favorite sx={{ color: isFavorite && '#ffa533' }} />
                    </IconButton>
                    {share &&
                        <WhatsappShareButton
                            title='¡Mirá lo bueno que está esto!'
                            url={`${process.env.NEXT_PUBLIC_CLIENT_URL}/product/${product._id}`}
                        >
                            <WhatsappIcon size={22} round={true} style={{ marginTop: '1vh' }} />
                        </WhatsappShareButton>
                    }
                    <IconButton onClick={handleClick}>
                        <Share />
                    </IconButton>
                    <IconButton>
                        <ShoppingCart />
                    </IconButton>
                </Grid>
            </CardActions>
        </Card>
    )
}