import Head from 'next/head'
import NextLink from 'next/link'
import Layout from '../../components/Layout'
import connectionDB from '../../utils/db'
import Product from '../../models/product'
import Category from '../../models/category'
import User from '../../models/user'
import Order from '../../models/order'
import { Grid, Stack, Typography, Link } from '@mui/material'

const stackStyles = {
    width: '200px',
    height: '200px',
    backgroundColor: 'secondary.main',
    borderRadius: '10px',
    boxShadow: '5px 5px 5px #24292f',
    '&:hover': {
        width: '220px',
        height: '220px'
    }
}

export default function Admin({ products, categories, users, orders }) {
    return (
        <Layout>
            <Head>
                <title>E-Commerce | Administrar</title>
            </Head>
            <Grid
                container
                justifyContent='center'
                alignItems='center'
                gap={5}
                sx={{ minHeight: '75vh' }}
            >
                <NextLink href={`/admin/products`} passHref>
                    <Link underline='none'>
                        <Stack direction='column' justifyContent='center' alignItems='center' sx={stackStyles}>
                            <Typography variant='h5' component='h5'>{products.length}</Typography>
                            <Typography variant='h5' component='h5'>Productos</Typography>
                        </Stack>
                    </Link>
                </NextLink>
                <NextLink href={`/admin/categories`} passHref>
                    <Link underline='none'>
                        <Stack direction='column' justifyContent='center' alignItems='center' sx={stackStyles}>
                            <Typography variant='h5' component='h5'>{categories.length}</Typography>
                            <Typography variant='h5' component='h5'>Categorias</Typography>
                        </Stack>
                    </Link>
                </NextLink>
                <NextLink href={`/admin/users`} passHref>
                    <Link underline='none'>
                        <Stack direction='column' justifyContent='center' alignItems='center' sx={stackStyles}>
                            <Typography variant='h5' component='h5'>{users.length}</Typography>
                            <Typography variant='h5' component='h5'>Usuarios</Typography>
                        </Stack>
                    </Link>
                </NextLink>
                <NextLink href={`/admin/orders`} passHref>
                    <Link underline='none'>
                        <Stack direction='column' justifyContent='center' alignItems='center' sx={stackStyles}>
                            <Typography variant='h5' component='h5'>{orders.length}</Typography>
                            <Typography variant='h5' component='h5'>Ventas</Typography>
                        </Stack>
                    </Link>
                </NextLink>
            </Grid>
        </Layout>
    )
}

export async function getServerSideProps() {
    await connectionDB()

    const products = await Product.find({}).lean()
    const categories = await Category.find({}).lean()
    const users = await User.find({}).lean()
    const orders = await Order.find({}).lean()

    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
            categories: JSON.parse(JSON.stringify(categories)),
            users: JSON.parse(JSON.stringify(users)),
            orders: JSON.parse(JSON.stringify(orders))
        }
    }
}