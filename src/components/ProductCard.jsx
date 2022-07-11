import NextLink from 'next/link'
import { Card, CardHeader, CardContent, CardActions, CardActionArea, IconButton, Link, Grid, Typography } from '@mui/material'
import { Favorite, Share, ShoppingCart } from '@mui/icons-material'

export default function ProductCard({ product }) {
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
            <CardActions>
                <Grid container justifyContent='space-around'>
                    <IconButton>
                        <Favorite />
                    </IconButton>
                    <IconButton>
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