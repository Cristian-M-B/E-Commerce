import { useState } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import { useStore } from '../context/StoreProvider'
import { Grid, FormControl, InputLabel, Select, MenuItem, Pagination, Typography } from '@mui/material'

export default function Favorites() {
    const { userInfo } = useStore();
    let { favorites } = userInfo;
    const [select, setSelect] = useState({
        name: '',
        price: '',
    });

    const [page, setPage] = useState(1);
    const productsPerPage = 12;
    const indexLastProducts = page * productsPerPage;
    const indexFirstProducts = indexLastProducts - productsPerPage;
    const currentProducts = favorites?.slice(indexFirstProducts, indexLastProducts);

    function handleChange(event, value) {
        setPage(value);
    }

    function sortName(e) {
        setSelect({
            name: e.target.value,
            price: ''
        })
        favorites = e.target.value === 'a-z'
            ? favorites.sort((a, b) => {
                if (a.name > b.name) return 1
                if (a.name < b.name) return -1
                return 0
            })
            : favorites.sort((a, b) => {
                if (a.name > b.name) return -1
                if (a.name < b.name) return 1
                return 0
            })
        setPage(1);
    }

    function sortPrice(e) {
        setSelect({
            price: e.target.value,
            name: ''
        })
        favorites = e.target.value === 'lower'
            ? favorites.sort((a, b) => a.price - b.price)
            : favorites.sort((a, b) => b.price - a.price)
        setPage(1);
    }

    if (!favorites?.length) {
        return (
            <Layout>
                <Head>
                    <title>E-Commerce | Favoritos</title>
                </Head>
                <Grid container direction='column' justifyContent='center' style={{ height: '75vh' }}>
                    <Typography variant='h5' component='h5' align='center'>¡No tenés Favoritos!</Typography>
                    <Typography variant='h6' component='h6' align='center'>Podes elegir un producto como favorito, haciendo click en el corazón.</Typography>
                </Grid>
            </Layout>
        )
    }

    return (
        <Layout>
            <Head>
                <title>E-Commerce | Favoritos</title>
            </Head>
            <Grid
                container
                justifyContent='center'
                style={{ marginBottom: '5vh' }}
            >
                <FormControl variant='standard' style={{ width: 110, marginRight: '2vw' }}>
                    <InputLabel>Nombre</InputLabel>
                    <Select
                        value={select.name}
                        onChange={sortName}
                    >
                        <MenuItem value='a-z'>A - Z</MenuItem>
                        <MenuItem value='z-a'>Z - A</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant='standard' style={{ width: 110, marginRight: '2vw' }}>
                    <InputLabel>Precio</InputLabel>
                    <Select
                        value={select.price}
                        onChange={sortPrice}
                    >
                        <MenuItem value='lower'>Menor</MenuItem>
                        <MenuItem value='higher'>Mayor</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid
                container
                justifyContent='center'
                alignItems='center'
            >
                {currentProducts?.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </Grid>

            <Grid
                container
                justifyContent='center'
            >
                <Pagination
                    count={Math.ceil(favorites?.length / productsPerPage)}
                    page={page}
                    onChange={handleChange}
                    variant='outlined'
                    shape='rounded'
                    color='primary'
                    style={{ marginBottom: '2vh', marginTop: '5vh' }}
                />
            </Grid>
        </Layout>
    )
}