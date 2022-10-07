import { useState } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import Layout from '../../../components/Layout'
import connectionDB from '../../../utils/db'
import Product from '../../../models/product'
import axios from 'axios'
import { parseCurrency } from '../../../utils/functions'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination } from '@mui/material'
import { Stack, Modal, Paper, Typography, TextField, Button, IconButton, Link } from '@mui/material'
import Search from '@mui/icons-material/Search'
import Close from '@mui/icons-material/Close'
import Add from '@mui/icons-material/Add'
import Edit from '@mui/icons-material/Edit'
import Delete from '@mui/icons-material/Delete'

const tableStyles = {
    width: '60%',
    '@media(max-width: 625px)': {
        width: '90%'
    },
    '@media(max-width: 547px)': {
        width: '100%'
    }
}

const modalStyles = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '450px',
    minHeight: '150px',
    padding: '15px',
    '@media(max-width: 500px)': {
        width: '90vw'
    }
}

const buttonStyles = {
    border: 'none',
    backgroundColor: 'transparent',
    padding: '0px',
    cursor: 'pointer'
}

export default function Products({ allProducts }) {
    const [products, setProducts] = useState(allProducts)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [search, setSearch] = useState(false)
    const [nameAsc, setNameAsc] = useState(true)
    const [productID, setProductID] = useState('')
    const [openModalDeleteProduct, setOpenModalDeleteProduct] = useState(false)

    const handleOpenDeleteProduct = () => setOpenModalDeleteProduct(true)
    const handleCloseDeleteProduct = () => setOpenModalDeleteProduct(false)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(+event.target.value))
        setPage(0)
    }

    const sortProductsByName = () => {
        setProducts(nameAsc
            ? products?.sort((a, b) => {
                if (a.name > b.name) return 1
                if (a.name < b.name) return -1
                return 0
            })
            : products?.sort((a, b) => {
                if (a.name > b.name) return -1
                if (a.name < b.name) return 1
                return 0
            })
        )
        setNameAsc(!nameAsc)
    }

    const searchProducts = (character) => {
        setProducts(allProducts?.filter(product => (
            product?.name.toLowerCase().includes(character.trim().toLowerCase())
        )))
    }

    const empty = () => {
        document.getElementById('textField').value = '';
    }

    const deleteProduct = async () => {
        const { data } = await axios.delete(`/api/products?id=${productID}`)
        setProducts(data)
        handleCloseDeleteProduct()
    }

    return (
        <Layout>
            <Head>
                <title>E-Commerce | Administrar Productos</title>
            </Head>
            <Stack direction='column' alignItems='center'>
                <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ ...tableStyles, padding: '10px' }}>
                    {search
                        ? <Stack direction='row'>
                            <TextField
                                variant='standard'
                                placeholder='Buscar'
                                id='textField'
                                onChange={(e) => searchProducts(e.target.value)}
                                sx={{ marginRight: '5px' }}
                            />
                            <IconButton onClick={() => { searchProducts(''), empty() }}>
                                <Close />
                            </IconButton>
                        </Stack>
                        : <Typography variant='h5' component='h5'>
                            Productos
                        </Typography>
                    }
                    <Stack direction='row'>
                        <IconButton onClick={() => setSearch(!search)}>
                            <Search />
                        </IconButton>
                        <NextLink href='/admin/products/add' passHref>
                            <Link underline='none'>
                                <IconButton>
                                    <Add />
                                </IconButton>
                            </Link>
                        </NextLink>
                    </Stack>
                </Stack>
                <TableContainer sx={tableStyles}>
                    <Table size='small'>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'secondary.main' }}>
                                <TableCell align='center'>
                                    <Typography variant='h6' component='h6'>
                                        Imagen
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <button onClick={sortProductsByName} style={buttonStyles}>
                                        <Typography variant='h6' component='h6'>
                                            Nombre
                                        </Typography>
                                    </button>
                                </TableCell>
                                <TableCell align='right'>
                                    <Typography variant='h6' component='h6'>
                                        Precio
                                    </Typography>
                                </TableCell>
                                <TableCell align='center'>
                                    <Typography variant='h6' component='h6'>
                                        Stock
                                    </Typography>
                                </TableCell>
                                <TableCell align='center'>
                                    <Typography variant='h6' component='h6'>
                                        Acciones
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(product => (
                                    <TableRow hover key={product._id}>
                                        <TableCell align='center'>
                                            <img src={product.images[0]} alt='Not Found' width='40' height='40' />
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                {product.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Typography>
                                                {parseCurrency(product.price)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Typography>
                                                {product.stock}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <NextLink href={`/admin/products/edit/${product._id}`} passHref>
                                                <Link underline='none'>
                                                    <IconButton>
                                                        <Edit />
                                                    </IconButton>
                                                </Link>
                                            </NextLink>
                                            <IconButton onClick={() => { setProductID(product._id), handleOpenDeleteProduct() }}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                            <Modal
                                open={openModalDeleteProduct}
                                onClose={handleCloseDeleteProduct}
                            >
                                <Stack component={Paper} direction='column' justifyContent='space-between' sx={modalStyles}>
                                    <Typography variant='h6' component='h6' align='center'>
                                        ¿Deseas eliminar este producto?
                                    </Typography>
                                    <Stack direction='row' justifyContent='space-around'>
                                        <Button variant='contained' color='secondary' onClick={deleteProduct}>
                                            Confirmar
                                        </Button>
                                        <Button variant='contained' color='secondary' onClick={handleCloseDeleteProduct}>
                                            Cancelar
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Modal>
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15, 20]}
                    component='div'
                    count={products.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Stack>
        </Layout >
    )
}

export async function getServerSideProps() {
    await connectionDB()
    const allProducts = await Product.find({}).lean()

    return {
        props: {
            allProducts: JSON.parse(JSON.stringify(allProducts))
        }
    }
}