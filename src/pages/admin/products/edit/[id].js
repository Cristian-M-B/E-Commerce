import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../../../../components/Layout'
import connectionDB from '../../../../utils/db'
import Product from '../../../../models/product'
import Category from '../../../../models/category'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Grid, Stack, Typography, TextField, Autocomplete, Button } from '@mui/material'

const stackStyles = {
    width: '35%',
    '@media(max-width: 600px)': {
        width: '80%'
    }
}

const buttonStyles = {
    border: 'none',
    backgroundColor: 'transparent',
    padding: '0px',
    cursor: 'pointer'
}

export default function EditProduct({ product, categories }) {
    let images = []
    const router = useRouter()
    const [input, setInput] = useState({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categories: product.categories,
        images: product.images
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
        if (input.name && input.description && input.price && input.stock && input.categories.length > 0) {
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
            const { data } = await axios.put(`/api/products?id=${product._id}`, { ...input, images: input.images.concat(images) })
            Swal.fire({
                icon: 'success',
                title: '¡Producto editado exitosamente!',
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
                <title>E-Commerce | Editar Producto</title>
            </Head>
            <Grid container direction='column' alignItems='center'>
                <Typography variant='h5' component='h5'>
                    Editar Producto
                </Typography>
                <Stack sx={stackStyles}>
                    <TextField
                        name='name'
                        label='Nombre'
                        value={input.name}
                        onChange={handleChange}
                        sx={{ marginTop: '15px', marginBottom: '10px' }}
                    />
                    <TextField
                        multiline
                        rows={3}
                        name='description'
                        label='Descripción'
                        value={input.description}
                        onChange={handleChange}
                        sx={{ marginBottom: '10px' }}
                    />
                    <Stack direction='row' justifyContent='space-between' sx={{ marginBottom: '10px' }}>
                        <TextField
                            type='number'
                            name='price'
                            label='Precio'
                            value={input.price}
                            onChange={handleChange}
                            inputProps={{ min: 0 }}
                            sx={{ width: '49%' }}
                        />
                        <TextField
                            type='number'
                            name='stock'
                            label='Stock'
                            value={input.stock}
                            onChange={handleChange}
                            inputProps={{ min: 0 }}
                            sx={{ width: '49%' }}
                        />
                    </Stack>
                    <Autocomplete
                        multiple
                        defaultValue={input.categories.sort((a, b) => {
                            if (a.name > b.name) return 1
                            if (a.name < b.name) return -1
                            return 0
                        })}
                        isOptionEqualToValue={(option, value) => {
                            return option._id === value._id
                        }}
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
                    <Typography>1° Eliminar imagenes existentes</Typography>
                    <Grid container gap={1} sx={{ marginTop: '15px', marginBottom: '15px' }}>
                        {input.images.map(image => (
                            <Stack direction='column' key={image}>
                                <img src={image} alt='Not Found' width='70' height='70' style={{ marginBottom: '5px' }} />
                                <button
                                    onClick={() => setInput({
                                        ...input,
                                        images: input.images.filter(img => img !== image)
                                    })}
                                    style={buttonStyles}
                                >
                                    Borrar
                                </button>
                            </Stack>
                        ))}
                    </Grid>
                    <Typography>2° Añadir nuevas imagenes</Typography>
                    <input
                        type='file'
                        accept='image/*'
                        multiple
                        onChange={(e) => images = e.target.files}
                        style={{ marginTop: '15px', marginBottom: '20px' }}
                    />
                    <Stack direction='row' justifyContent='space-between'>
                        <Button variant='contained' color='secondary' onClick={handleSubmit} sx={{ width: '45%' }}>
                            Editar
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

export async function getServerSideProps({ query }) {
    await connectionDB()
    const product = await Product.findById(query.id).populate('categories').lean()
    const categories = await Category.find({}).lean()

    return {
        props: {
            product: JSON.parse(JSON.stringify(product)),
            categories: JSON.parse(JSON.stringify(categories))
        }
    }
}