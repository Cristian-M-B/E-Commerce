import NextLink from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { TextField, InputAdornment, IconButton, Grid, Card, CardHeader, Divider, Link, Typography } from '@mui/material'
import { Search } from '@mui/icons-material'
import { useStore } from '../context/StoreProvider'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    grid: {
        boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
        position: 'absolute',
        width: '29%',
        maxHeight: '240px',
        overflowX: 'hidden',
        overflowY: 'auto',
        zIndex: '20',
        backgroundColor: 'white',
        borderRadius: '1vh',
    },
    card: {
        '&:hover': {
            backgroundColor: theme.palette.secondary.main
        }
    },
    text: {
        color: 'black',
    }
}));

export default function SearchBar() {
    const { allProducts } = useStore();
    const [search, setSearch] = useState('')
    const [results, setResults] = useState([])
    const [focused, setFocused] = useState(false);
    const input = useRef();
    const classes = useStyles()

    useEffect(() => {
        if (search.length > 0) {
            setResults(allProducts.filter(product => product.name.toLowerCase().includes(search.toLowerCase())))
        }
    }, [search])

    function handleSubmit(e) {
        e.preventDefault();
        input.current.blur();
        setSearch('')
    }

    return (
        <form style={{ width: '30%' }} onSubmit={handleSubmit}>
            <TextField
                fullWidth
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                inputRef={input}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
                variant='outlined'
                style={{ backgroundColor: 'white', borderRadius: '1vh' }}
                InputProps={{
                    startAdornment:
                        <InputAdornment position='start'>
                            <IconButton color='primary'>
                                <Search />
                            </IconButton>
                        </InputAdornment>
                }}
            />
            {search.length > 0 && focused &&
                <Grid className={classes.grid}>
                    {results.length > 0
                        ? results.map(result => (
                            <Card key={result.name} className={classes.card}>
                                <NextLink href={`/product/${result._id}`} passHref>
                                    <Link underline='none' onClick={() => setSearch('')}>
                                        <Grid container direction='row' alignItems='center' wrap='nowrap' style={{ paddingLeft: '10px', minHeight: '60px' }}>
                                            <img src={result.images[0]} alt='Not Found' height='50' width='50' />
                                            <Typography
                                                noWrap={true}
                                                variant='h6'
                                                component='h6'
                                                style={{paddingLeft:'10px'}}
                                            >
                                                {result.name}
                                            </Typography>
                                        </Grid>
                                    </Link>
                                </NextLink>
                                <Divider variant='middle' />
                            </Card>
                        ))
                        : <Grid container justifyContent='center' alignItems='center' style={{ minHeight: '60px' }}>
                            <Typography variant='h6' component='h6' className={classes.text}>
                                No hay coincidencias
                            </Typography>
                        </Grid>
                    }
                </Grid>
            }
        </form >
    )
}