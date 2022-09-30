import { useState } from 'react'
import Head from 'next/head'
import Layout from '../../components/Layout'
import connectionDB from '../../utils/db'
import Order from '../../models/order'
import axios from 'axios'
import { parseCurrency, paymentStatus, paymentStatusColor } from '../../utils/functions'
import { styled } from '@mui/material/styles'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination } from '@mui/material'
import { Stack, Typography, IconButton, Modal, Paper, FormControl, FormControlLabel, FormLabel, RadioGroup, Radio, Button, Tooltip, tooltipClasses, TextField } from '@mui/material'
import Search from '@mui/icons-material/Search'
import FilterAlt from '@mui/icons-material/FilterAlt'
import Edit from '@mui/icons-material/Edit'
import Close from '@mui/icons-material/Close'

const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11
    },
}))

const tableStyles = {
    width: '75%',
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
    minHeight: 'auto',
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

export default function Orders({ allOrders }) {
    const [orders, setOrders] = useState(allOrders)
    const [products, setProducts] = useState([])
    const [status, setStatus] = useState('')
    const [id, setId] = useState('')
    const [search, setSearch] = useState(false)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [openProducts, setOpenProducts] = useState(false)
    const [openStatus, setOpenStatus] = useState(false)
    const [tooltipOpen, setTooltipOpen] = useState(false)

    const handleOpenProducts = () => setOpenProducts(true)
    const handleCloseProducts = () => setOpenProducts(false)
    const handleOpenStatus = () => setOpenStatus(true)
    const handleCloseStatus = () => { setOpenStatus(false), setStatus('') }
    const handleTooltipOpen = () => setTooltipOpen(true)
    const handleTooltipClose = () => setTooltipOpen(false)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(+event.target.value))
        setPage(0)
    }

    const changeStatus = (e) => {
        setStatus(e.target.value)
    }

    const sendStatus = async () => {
        if (status) {
            const { data } = await axios.put(`/api/order`, { id, status })
            data.reverse()
            setOrders(data)
        }
        handleCloseStatus()
    }

    const sortOrdersByDate = () => {
        const sortOrders = orders.reverse()
        setOrders([...sortOrders])
    }

    const filterOrdersByStatus = (e) => {
        setOrders(allOrders?.filter(order => order?.paymentStatus === e.target.value))
        handleTooltipClose()
    }

    const resetFilter = () => {
        setOrders(allOrders)
        handleTooltipClose()
    }

    const searchOrders = (character) => {
        setOrders(allOrders?.filter(order => (
            order?.user.firstName.toLowerCase().includes(character.trim().toLowerCase())
            || order?.user.lastName.toLowerCase().includes(character.trim().toLowerCase())
        )))
    }

    const empty = () => {
        document.getElementById('textField').value = '';
    }

    return (
        <Layout>
            <Head>
                <title>E-Commerce | Administrar Ordenes</title>
            </Head>
            <Stack direction='column' alignItems='center'>
                <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ ...tableStyles, padding: '10px' }}>
                    {search
                        ? <Stack direction='row'>
                            <TextField
                                variant='standard'
                                placeholder='Buscar'
                                id='textField'
                                onChange={(e) => searchOrders(e.target.value)}
                                sx={{ marginRight: '5px' }}
                            />
                            <IconButton onClick={() => { searchOrders(''), empty() }}>
                                <Close />
                            </IconButton>
                        </Stack>
                        : <Typography variant='h5' component='h5'>Ordenes</Typography>
                    }
                    <Stack direction='row' justifyContent='space-between'>
                        <IconButton onClick={() => setSearch(!search)}>
                            <Search />
                        </IconButton>
                        <LightTooltip
                            open={tooltipOpen}
                            title={
                                <Stack>
                                    <Typography align='center' sx={{ textDecoration: 'underline' }}>Filtros</Typography>
                                    <FormControl>
                                        <FormLabel align='center' sx={{ marginTop: '5px' }}>Estado</FormLabel>
                                        <RadioGroup
                                            onChange={filterOrdersByStatus}
                                        >
                                            <FormControlLabel value='preparing' control={<Radio size='small' />} label='Preparando' />
                                            <FormControlLabel value='traveling' control={<Radio size='small' />} label='Viajando' />
                                            <FormControlLabel value='delivered' control={<Radio size='small' />} label='Entregado' />
                                            <FormControlLabel value='approved' control={<Radio size='small' />} label='Pagado' />
                                            <FormControlLabel value='pending' control={<Radio size='small' />} label='Pendiente' />
                                            <FormControlLabel value='cancelled' control={<Radio size='small' />} label='Cancelado' />
                                        </RadioGroup>
                                    </FormControl>
                                    <Button onClick={resetFilter} sx={{ textTransform: 'none' }}>Reset</Button>
                                </Stack>
                            }
                        >
                            <IconButton onClick={() => { tooltipOpen ? handleTooltipClose() : handleTooltipOpen() }}>
                                <FilterAlt />
                            </IconButton>
                        </LightTooltip>
                    </Stack>
                </Stack>
                <TableContainer sx={tableStyles}>
                    <Table size='small'>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'secondary.main' }}>
                                <TableCell>
                                    <button onClick={sortOrdersByDate} style={buttonStyles}>
                                        <Typography variant='h6' component='h6'>
                                            Fecha
                                        </Typography>
                                    </button>
                                </TableCell>
                                <TableCell>
                                    <Typography variant='h6' component='h6'>
                                        Comprador
                                    </Typography>
                                </TableCell>
                                <TableCell align='center'>
                                    <Typography variant='h6' component='h6'>
                                        Productos
                                    </Typography>
                                </TableCell>
                                <TableCell align='center'>
                                    <Typography variant='h6' component='h6'>
                                        Total
                                    </Typography>
                                </TableCell>
                                <TableCell align='center'>
                                    <Typography variant='h6' component='h6'>
                                        Estado
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
                            {orders?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(order => (
                                    <TableRow hover>
                                        <TableCell>
                                            <Typography>
                                                {order.date[9] === ',' ? order.date.substring(0, 9) : order.date.substring(0, 10)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                {order.user.lastName}, {order.user.firstName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Typography>
                                                <button onClick={() => { setProducts(order.products), handleOpenProducts() }} style={{ ...buttonStyles, textDecoration: 'underline' }}>
                                                    Ver
                                                </button>
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Typography>
                                                {parseCurrency(order?.products?.reduce((acc, item) => acc += (item.quantity * item.price), 0))}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Typography color={paymentStatusColor(order.paymentStatus)} sx={{ fontWeight: 'bold' }}>
                                                {paymentStatus(order.paymentStatus)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <IconButton onClick={() => { setId(order._id), handleOpenStatus() }}>
                                                <Edit />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            <Modal
                                open={openProducts}
                                onClose={handleCloseProducts}
                            >
                                <Stack component={Paper} sx={modalStyles}>
                                    <TableContainer>
                                        <Table size='small'>
                                            <TableHead sx={{ backgroundColor: 'secondary.main' }}>
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography>
                                                            Imagen
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>
                                                            Nombre
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>
                                                            Cantidad
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align='center'>
                                                        <Typography>
                                                            SubTotal
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {products?.map(detail => (
                                                    <TableRow>
                                                        <TableCell>
                                                            <img src={detail.images[0]} alt='Not Found' width='40' height='40' />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography>
                                                                {detail.name}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                            <Typography>
                                                                {detail.quantity}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                            <Typography>
                                                                {parseCurrency(detail.quantity * detail.price)}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Stack>
                            </Modal>
                            <Modal
                                open={openStatus}
                                onClose={handleCloseStatus}
                            >
                                <Stack component={Paper} direction='column' justifyContent='space-between' sx={{ ...modalStyles, minHeight: '220px' }}>
                                    <Typography variant='h6' component='h6' align='center'>Cambiar estado de la orden</Typography>
                                    <FormControl>
                                        <RadioGroup
                                            onChange={changeStatus}
                                        >
                                            <Stack direction='row' justifyContent='center'>
                                                <Stack direction='column' >
                                                    <FormControlLabel value='preparing' control={<Radio size='small' />} label='Preparando' />
                                                    <FormControlLabel value='delivered' control={<Radio size='small' />} label='Entregado' />
                                                </Stack>
                                                <Stack direction='column' >
                                                    <FormControlLabel value='traveling' control={<Radio size='small' />} label='Viajando' />
                                                    <FormControlLabel value='cancelled' control={<Radio size='small' />} label='Cancelado' />
                                                </Stack>
                                            </Stack>
                                        </RadioGroup>
                                    </FormControl>
                                    <Stack direction='row' justifyContent='space-around'>
                                        <Button variant='contained' color='secondary' onClick={sendStatus}>
                                            Confirmar
                                        </Button>
                                        <Button variant='contained' color='secondary' onClick={handleCloseStatus}>
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
                    count={orders.length}
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
    const orders = await Order.find({}).populate('user').lean()
    const allOrders = orders?.reverse()

    return {
        props: {
            allOrders: JSON.parse(JSON.stringify(allOrders))
        }
    }
}