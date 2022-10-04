import { useState } from 'react'
import Head from 'next/head'
import Layout from '../../components/Layout'
import connectionDB from '../../utils/db'
import Category from '../../models/category'
import axios from 'axios'
import { Stack, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination, Typography, IconButton, Modal, Paper, Button, TextField } from '@mui/material'
import Add from '@mui/icons-material/Add'
import Edit from '@mui/icons-material/Edit'
import Delete from '@mui/icons-material/Delete'

const tableStyles = {
    width: '35vw',
    '@media(max-width: 525px)': {
        width: '75vw'
    },
    '@media(max-width: 350px)': {
        width: '100%'
    }
}

const modalStyles = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '450px',
    minHeight: '200px',
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

export default function Categories({ allCategories }) {
    const [categories, setCategories] = useState(allCategories)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [orderAsc, setOrderAsc] = useState(true)
    const [input, setInput] = useState('')
    const [id, setId] = useState('')
    const [openAdd, setOpenAdd] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)

    const handleOpenAdd = () => setOpenAdd(true)
    const handleCloseAdd = () => setOpenAdd(false)
    const handleOpenEdit = () => setOpenEdit(true)
    const handleCloseEdit = () => setOpenEdit(false)
    const handleOpenDelete = () => setOpenDelete(true)
    const handleCloseDelete = () => setOpenDelete(false)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(+event.target.value))
        setPage(0)
    }

    const sortCategories = () => {
        setCategories(orderAsc
            ? categories?.sort((a, b) => {
                if (a.name > b.name) return 1
                if (a.name < b.name) return -1
                return 0
            })
            : categories?.sort((a, b) => {
                if (a.name > b.name) return -1
                if (a.name < b.name) return 1
                return 0
            })
        )
        setOrderAsc(!orderAsc)
        setPage(0)
    }

    async function addCategory(input) {
        if (input) {
            const { data } = await axios.post('/api/categories', { name: input })
            setCategories(data)
            setInput('')
        }
        handleCloseAdd()
    }

    async function editCategory(id, input) {
        if (input) {
            const { data } = await axios.put('/api/categories', { id, name: input })
            setCategories(data)
            setInput('')
        }
        handleCloseEdit()
    }

    async function deleteCategory(id) {
        const { data } = await axios.delete(`/api/categories?id=${id}`)
        setCategories(data)
        handleCloseDelete()
    }

    return (
        <Layout>
            <Head>
                <title>E-Commerce | Administrar Categorias</title>
            </Head>
            <Stack direction='column' alignItems='center'>
                <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ ...tableStyles, padding: '10px' }}>
                    <Typography variant='h5' component='h5'>
                        Categorias
                    </Typography>
                    <IconButton onClick={handleOpenAdd}>
                        <Add />
                    </IconButton>
                    <Modal
                        open={openAdd}
                        onClose={handleCloseAdd}
                    >
                        <Paper sx={modalStyles}>
                            <Typography variant='h6' component='h6' align='center'>Agregar Categoria</Typography>
                            <TextField
                                fullWidth
                                label='Nombre'
                                onChange={(e) => setInput(e.target.value)}
                                sx={{ marginTop: '25px', marginBottom: '25px' }}
                            />
                            <Stack direction='row' justifyContent='space-around'>
                                <Button variant='contained' color='secondary' onClick={() => addCategory(input)}>Confirmar</Button>
                                <Button variant='contained' color='secondary' onClick={handleCloseAdd}>Cancelar</Button>
                            </Stack>
                        </Paper>
                    </Modal>
                </Stack>
                <TableContainer sx={tableStyles}>
                    <Table size='small'>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'secondary.main' }}>
                                <TableCell>
                                    <button onClick={sortCategories} style={buttonStyles}>
                                        <Typography variant='h6' component='h6'>
                                            Nombre
                                        </Typography>
                                    </button>
                                </TableCell>
                                <TableCell align='right'>
                                    <Typography variant='h6' component='h6'>
                                        Acciones
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(category => (
                                    <TableRow hover key={category._id}>
                                        <TableCell>
                                            <Typography>
                                                {category.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='right'>
                                            <IconButton onClick={() => { setId(category._id), handleOpenEdit() }}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton onClick={() => { setId(category._id), handleOpenDelete() }}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                            <Modal
                                open={openEdit}
                                onClose={handleCloseEdit}
                            >
                                <Paper sx={modalStyles}>
                                    <Typography variant='h6' component='h6' align='center'>Editar Categoria</Typography>
                                    <TextField
                                        fullWidth
                                        label='Nombre'
                                        onChange={(e) => setInput(e.target.value)}
                                        sx={{ marginTop: '25px', marginBottom: '25px' }}
                                    />
                                    <Stack direction='row' justifyContent='space-around'>
                                        <Button variant='contained' color='secondary' onClick={() => editCategory(id, input)}>Confirmar</Button>
                                        <Button variant='contained' color='secondary' onClick={handleCloseEdit}>Cancelar</Button>
                                    </Stack>
                                </Paper>
                            </Modal>
                            <Modal
                                open={openDelete}
                                onClose={handleCloseDelete}
                            >
                                <Stack component={Paper} direction='column' justifyContent='space-between' sx={{ ...modalStyles, minHeight: '150px' }}>
                                    <Typography variant='h6' component='h6' align='center'>¿Deseas eliminar esta categoria?</Typography>
                                    <Stack direction='row' justifyContent='space-around'>
                                        <Button variant='contained' color='secondary' onClick={() => deleteCategory(id)}>Confirmar</Button>
                                        <Button variant='contained' color='secondary' onClick={handleCloseDelete}>Cancelar</Button>
                                    </Stack>
                                </Stack>
                            </Modal>
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15, 20]}
                    component='div'
                    count={categories.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Stack>
        </Layout>
    )
}

export async function getServerSideProps() {
    await connectionDB()
    const allCategories = await Category.find({}).lean()

    return {
        props: {
            allCategories: JSON.parse(JSON.stringify(allCategories))
        }
    }
}