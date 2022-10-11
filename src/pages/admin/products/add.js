import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import connectionDB from '../../../utils/db'
import Category from '../../../models/category'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Grid, Stack, Typography, TextField, Autocomplete, Button } from '@mui/material'

const stackStyles = {
    width: '35%',
    '@media(max-width: 600px)': {
        width: '80%'
    }
}

export default function AddProduct({ categories }) {
    let images = []
    const router = useRouter()
    const [input, setInput] = useState({
        name: '',
        description: '',
        stock: '',
        price: '',
        categories: []
    })

    const handleChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    const uploadFiles = async () => {
        const files = []
        const formData = new FormData()
        for (const image of images) {
            files.push(image)
        }
        images = await Promise.all(files?.map(async file => {
            formData.append('file', file)
            formData.append('upload_preset', 'pxqfbzmp')
            const { data } = await axios.post('https://api.cloudinary.com/v1_1/ddouuo3xs/image/upload', formData)
            return data.url
        }))
    }

    const completedFields = () => {
        if (input.name && input.description && input.price && input.stock && input.categories.length > 0 && images[0]) {
            return true
        }
        return false
    }

    const handleSubmit = async () => {
        if (completedFields()) {
            Swal.fire({
                icon: 'info',
                title: 'Procesando...',
                text: '¡Aguarde un momento!',
                showConfirmButton: false,
                allowOutsideClick: false
            })
            await uploadFiles()
            const { data } = await axios.post('/api/products', { ...input, images })
            Swal.fire({
                icon: 'success',
                title: '¡Producto agregado exitosamente!',
                showConfirmButton: false,
                timer: 2000
            })
            router.back()
        } else {
            Swal.fire({
                icon: 'info',
                title: '¡Todos los campos son obligatorios!',
                confirmButtonText: 'Cerrar',
                timer: 5000
            })
        }
    }

    return (
        <Layout>
            <Head>
                <title>E-Commerce | Agregar Producto</title>
            </Head>
            <Grid container direction='column' alignItems='center'>
                <Typography variant='h5' component='h5'>
                    Agregar Producto
                </Typography>
                <Stack sx={stackStyles}>
                    <TextField
                        label='Nombre'
                        name='name'
                        value={input.name}
                        onChange={handleChange}
                        sx={{ marginTop: '15px', marginBottom: '10px' }}
                    />
                    <TextField
                        multiline
                        rows={3}
                        label='Descripción'
                        name='description'
                        value={input.description}
                        onChange={handleChange}
                        sx={{ marginBottom: '10px' }}
                    />
                    <Stack direction='row' justifyContent='space-between'>
                        <TextField
                            type='number'
                            label='Precio'
                            name='price'
                            value={input.price}
                            onChange={handleChange}
                            inputProps={{ min: 0 }}
                            sx={{ marginBottom: '10px', width: '49%' }}
                        />
                        <TextField
                            type='number'
                            label='Stock'
                            name='stock'
                            value={input.stock}
                            onChange={handleChange}
                            inputProps={{ min: 0 }}
                            sx={{ marginBottom: '10px', width: '49%' }}
                        />
                    </Stack>
                    <Autocomplete
                        multiple
                        options={categories.sort((a, b) => {
                            if (a.name > b.name) return 1
                            if (a.name < b.name) return -1
                            return 0
                        })}
                        getOptionLabel={category => category.name}
                        onChange={(event, newValue) => {
                            setInput({
                                ...input,
                                categories: newValue.map(value => value._id)
                            })
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label='Categorias'
                                sx={{ marginBottom: '15px' }}
                            />
                        )}
                    />
                    <input
                        type='file'
                        accept='image/*'
                        multiple
                        onChange={(e) => images = e.target.files}
                    />
                    <Typography variant='body2' sx={{ marginTop: '5px', marginBottom: '15px' }}>
                        * Manten presionado 'Ctrl' para seleccionar más de una imagen
                    </Typography>
                    <Stack direction='row' justifyContent='space-between'>
                        <Button variant='contained' color='secondary' onClick={handleSubmit} sx={{ width: '45%' }}>
                            Agregar
                        </Button>
                        <Button variant='contained' color='secondary' onClick={() => router.back()} sx={{ width: '45%' }}>
                            Volver
                        </Button>
                    </Stack>
                </Stack>
            </Grid>
        </Layout>
    )
}

export async function getServerSideProps() {
    connectionDB()

    const categories = await Category.find({}).lean()

    return {
        props: {
            categories: JSON.parse(JSON.stringify(categories))
        }
    }
}