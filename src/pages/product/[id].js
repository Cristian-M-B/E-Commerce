import Head from 'next/head'
import connectionDB from '../../utils/db'
import Product from '../../models/product'
import Layout from '../../components/Layout'
import { Grid, Typography, Stack } from '@mui/material'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

export default function Detail({ product }) {
    return (
        <Layout>
            <Head>
                <title>E-Commerce | {product.name}</title>
            </Head>
            <Grid container direction='row' justifyContent='space-evenly'>
                <Carousel width='350px'>
                    {product.images.map((image, index) => {
                        return <img key={index}
                            src={image}
                            alt='Not Found'
                        />
                    })}
                </Carousel>
                <Stack direction='column'>
                    <Typography variant='h4' component='h4' align='center' style={{marginBottom: '4vh'}}>{product.name}</Typography>
                    <Typography style={{marginBottom: '2vh'}}>{product.description}</Typography>
                    <Typography>Precio: ${product.price}</Typography>
                    <Typography>Stock: {product.stock}</Typography>
                </Stack>
            </Grid>
        </Layout>
    )
}

export async function getServerSideProps({ params }) {

    await connectionDB();

    const product = await Product.findById(params.id).lean()

    return {
        props: {
            product: JSON.parse(JSON.stringify(product))
        }
    }
}