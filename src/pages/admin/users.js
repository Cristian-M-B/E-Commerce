import { useState } from 'react'
import Head from 'next/head'
import Layout from '../../components/Layout'
import connectionDB from '../../utils/db'
import User from '../../models/user'
import axios from 'axios'
import { styled } from '@mui/material/styles'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TablePagination } from '@mui/material'
import { Stack, Modal, Paper, Typography, TextField, Button, IconButton, Tooltip, tooltipClasses, FormControl, FormControlLabel, FormLabel, RadioGroup, Radio } from '@mui/material'
import Search from '@mui/icons-material/Search'
import FilterAlt from '@mui/icons-material/FilterAlt'
import Security from '@mui/icons-material/Security'
import Block from '@mui/icons-material/Block'
import Done from '@mui/icons-material/Done'
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

export default function Users({ allUsers }) {
    const [users, setUsers] = useState(allUsers)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [orderFirstNameAsc, setOrderFirstNameAsc] = useState(true)
    const [orderLastNameAsc, setOrderLastNameAsc] = useState(true)
    const [search, setSearch] = useState(false)
    const [tooltipOpen, setTooltipOpen] = useState(false)
    const [id, setId] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    const [openAdmin, setOpenAdmin] = useState(false)

    const handleOpenAdmin = () => setOpenAdmin(true)
    const handleCloseAdmin = () => setOpenAdmin(false)

    const handleTooltipOpen = () => setTooltipOpen(true)
    const handleTooltipClose = () => setTooltipOpen(false)

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(+event.target.value))
        setPage(0)
    }

    const sortUsersByLastName = () => {
        setUsers(orderLastNameAsc
            ? users?.sort((a, b) => {
                if (a.lastName > b.lastName) return 1
                if (a.lastName < b.lastName) return -1
                return 0
            })
            : users?.sort((a, b) => {
                if (a.lastName > b.lastName) return -1
                if (a.lastName < b.lastName) return 1
                return 0
            })
        )
        setOrderLastNameAsc(!orderLastNameAsc)
    }

    const sortUsersByFirstName = () => {
        setUsers(orderFirstNameAsc
            ? users?.sort((a, b) => {
                if (a.firstName > b.firstName) return 1
                if (a.firstName < b.firstName) return -1
                return 0
            })
            : users?.sort((a, b) => {
                if (a.firstName > b.firstName) return -1
                if (a.firstName < b.firstName) return 1
                return 0
            })
        )
        setOrderFirstNameAsc(!orderFirstNameAsc)
    }

    const filterUsersByAdmin = (e) => {
        setUsers(e.target.value === 'yes'
            ? allUsers?.filter(user => user?.isAdmin)
            : allUsers?.filter(user => !user?.isAdmin)
        )
        handleTooltipClose()
    }

    const resetFilter = () => {
        setUsers(allUsers)
        handleTooltipClose()
    }

    const searchUsers = (character) => {
        setUsers(allUsers?.filter(user => (
            user?.firstName.toLowerCase().includes(character.trim().toLowerCase())
            || user?.lastName.toLowerCase().includes(character.trim().toLowerCase())
        )))
    }

    const empty = () => {
        document.getElementById('textField').value = '';
    }

    async function changePrivileges() {
        const { data } = await axios.put(`/api/user?user=${id}&isAdmin=true`, { isAdmin })
        setUsers(data)
        handleCloseAdmin()
    }

    return (
        <Layout>
            <Head>
                <title>E-Commerce | Administrar Usuarios</title>
            </Head>
            <Stack direction='column' alignItems='center'>
                <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ ...tableStyles, padding: '10px' }}>
                    {search
                        ? <Stack direction='row'>
                            <TextField
                                variant='standard'
                                placeholder='Buscar'
                                id='textField'
                                onChange={(e) => searchUsers(e.target.value)}
                                sx={{ marginRight: '5px' }}
                            />
                            <IconButton onClick={() => { searchUsers(''), empty() }}>
                                <Close />
                            </IconButton>
                        </Stack>
                        : <Typography variant='h5' component='h5'>Usuarios</Typography>
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
                                        <FormLabel align='center' sx={{ marginTop: '5px' }}>Admin</FormLabel>
                                        <RadioGroup
                                            onChange={filterUsersByAdmin}
                                        >
                                            <FormControlLabel value='yes' control={<Radio size='small' />} label='Si' />
                                            <FormControlLabel value='no' control={<Radio size='small' />} label='No' />
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
                                <TableCell align='center'>
                                    <Typography variant='h6' component='h6'>
                                        Avatar
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <button onClick={sortUsersByLastName} style={buttonStyles}>
                                        <Typography variant='h6' component='h6'>
                                            Apellido
                                        </Typography>
                                    </button>
                                </TableCell>
                                <TableCell>
                                    <button onClick={sortUsersByFirstName} style={buttonStyles}>
                                        <Typography variant='h6' component='h6'>
                                            Nombre
                                        </Typography>
                                    </button>
                                </TableCell>
                                <TableCell align='center'>
                                    <Typography variant='h6' component='h6'>
                                        Admin
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
                            {users?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(user => (
                                    <TableRow hover key={user._id}>
                                        <TableCell align='center'>
                                            {user.image &&
                                                <img src={user.image} alt='Not Found' width='40' height='40' style={{ borderRadius: '50%' }} />
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                {user.lastName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                {user.firstName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='center'>
                                            {user.isAdmin
                                                ? <Done sx={{ color: 'success.main' }} />
                                                : <Close sx={{ color: 'error.main' }} />
                                            }
                                        </TableCell>
                                        <TableCell align='center'>
                                            <IconButton onClick={() => { setId(user._id), setIsAdmin(!user.isAdmin), handleOpenAdmin() }}>
                                                <Security />
                                            </IconButton>
                                            <IconButton>
                                                <Block />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                            <Modal
                                open={openAdmin}
                                onClose={handleCloseAdmin}
                            >
                                <Stack component={Paper} direction='column' justifyContent='space-between' sx={{ ...modalStyles, minHeight: '150px' }}>
                                    <Typography variant='h6' component='h6' align='center'>¿Deseas cambiar los privilegios de este usuario?</Typography>
                                    <Stack direction='row' justifyContent='space-around'>
                                        <Button variant='contained' color='secondary' onClick={changePrivileges}>Confirmar</Button>
                                        <Button variant='contained' color='secondary' onClick={handleCloseAdmin}>Cancelar</Button>
                                    </Stack>
                                </Stack>
                            </Modal>
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15, 20]}
                    component='div'
                    count={users.length}
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
    const allUsers = await User.find({}).lean()

    return {
        props: {
            allUsers: JSON.parse(JSON.stringify(allUsers))
        }
    }
}