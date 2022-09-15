import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useStore, useDispatch } from '../context/StoreProvider'
import { actionsTypes } from '../context/StoreReducer'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Grid, Typography, Rating, TextField, Button, Avatar } from '@mui/material'

const containerStyles = {
    '@media(max-width: 550px)': {
        marginTop: '4vh'
    }
}

const gridStyles = {
    width: '35%',
    padding: '10px',
    border: '1px black solid',
    marginBottom: '4vh',
    '@media (max-width: 550px)': {
        width: '100%'
    }
}

export default function Reviews({ orders }) {
    const [punctuation, setPunctuation] = useState(0);
    const [comment, setComment] = useState('');
    const { userInfo, reviews } = useStore();
    const dispatch = useDispatch();
    const router = useRouter();
    const productID = router.query.id;
    let sum = 0;
    let quantity = 0;
    let isOrdered = false;
    let isQualified = false;

    useEffect(() => {
        getReviews();
    }, [])

    async function getReviews() {
        try {
            const response = await axios.get('/api/reviews')
            dispatch({ type: actionsTypes.GET_REVIEWS, payload: response.data })
        } catch (error) {
            console.log(error)
        }
    }

    async function handleSubmit(e) {
        if (punctuation && comment) {
            e.preventDefault();
            const newReview = {
                product: productID,
                user: userInfo._id,
                comment: comment.charAt(0).toUpperCase() + comment.slice(1),
                punctuation,
                date: new Date().toLocaleString()
            }
            const response = await axios.post('/api/reviews', newReview);
            dispatch({ type: actionsTypes.GET_REVIEWS, payload: response.data })
            setPunctuation(0);
            setComment('');
        } else {
            Swal.fire({
                icon: 'info',
                text: 'Debes completar tanto la puntuación como el comentario',
                confirmButtonText: 'Cerrar',
                timer: 5000
            })
        }
    }

    return (
        <Grid
            container
            direction='column'
            alignItems='center'
            sx={containerStyles}
        >
            {reviews?.forEach(review => {
                if (review.product._id === productID) {
                    sum += review.punctuation;
                    quantity++;
                    if (review.user._id === userInfo?._id) {
                        isQualified = true;
                    }
                }
            })}

            <Grid container direction='column' alignItems='center' justifyContent='space-between' sx={{ ...gridStyles, minHeight: '150px' }}>
                <Typography variant='h6' component='h6'>Calificación General</Typography>
                <Grid container justifyContent='center' alignItems='center'>
                    {quantity > 0 &&
                        <Typography variant='h6' component='h6' sx={{ marginRight: '10px' }}>{(sum / quantity).toFixed(1)}</Typography>
                    }
                    <Rating value={sum / quantity} precision={0.1} size='large' readOnly />
                </Grid>
                {quantity
                    ? <Typography>Promedio de {quantity} {quantity > 1 ? 'calificaciones' : 'calificación'}</Typography>
                    : <Typography>Este producto aún no tiene calificación</Typography>
                }
            </Grid>

            {orders?.forEach(order => {
                if (order.user?._id === userInfo?._id) {
                    order.products.forEach(product => {
                        if (product.id === productID) {
                            isOrdered = true;
                        }
                    })
                }
            })}

            {isOrdered && !isQualified &&
                <Grid container direction='column' alignItems='center' sx={gridStyles}>
                    <Typography>¿Que te parece el producto que compraste?</Typography>
                    <Grid container justifyContent='space-between' sx={{ marginTop: '3vh', marginBottom: '2vh' }}>
                        <Typography sx={{ marginLeft: '14px' }}>Deja tu puntuación</Typography>
                        <Rating
                            value={punctuation}
                            onChange={(event, newValue) => setPunctuation(newValue)}
                            sx={{ marginRight: '14px' }}
                        />
                    </Grid>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant='outlined'
                        label='Deja tu comentario'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        sx={{ marginBottom: '2vh' }}
                    />
                    <Button
                        fullWidth
                        variant='contained'
                        color='secondary'
                        onClick={handleSubmit}
                    >
                        Enviar
                    </Button>
                </Grid>
            }

            {reviews?.map(review => {
                return review.product._id === productID
                    ? <Grid container direction='column' sx={{ ...gridStyles, minHeight: '150px', marginBottom: '2vh' }} key={review._id}>
                        <Grid container alignItems='center' sx={{ marginBottom: '10px' }}>
                            <Avatar src={review?.user?.image} alt='Not Found' sx={{ marginRight: '10px' }} />
                            <Typography>{review.user.firstName} {review.user.lastName}</Typography>
                        </Grid>
                        <Grid container justifyContent='space-between'>
                            <Typography>Puntuación: {review.punctuation}/5</Typography>
                            <Rating value={review.punctuation} readOnly />
                        </Grid>
                        <Typography sx={{ marginTop: '15px', marginBottom: '15px' }}>{review.comment}</Typography>
                        <Typography>Creado el {review.date}</Typography>
                    </Grid>
                    : null
            }).reverse()}
        </Grid>
    )
}