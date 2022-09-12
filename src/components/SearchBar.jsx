import NextLink from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { TextField, InputAdornment, Grid, Card, Divider, Link, Typography } from '@mui/material'
import Search from '@mui/icons-material/Search'
import { useStore } from '../context/StoreProvider'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    card: {
        '&:hover': {
            backgroundColor: theme.palette.secondary.main
        }
    },
    text: {
        color: 'black',
    }
}));

const searchStyles = { 
    backgroundColor: 'white', 
    borderRadius: '1vh', 
    width: '30vw',
    '@media(max-width: 400px)': {
        width: '25vw'
    }
}

const optionsStyles = {
    boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
    position: 'absolute',
    width: '30vw',
    maxHeight: '203px',
    overflowX: 'hidden',
    overflowY: 'auto',
    zIndex: '20',
    backgroundColor: 'white',
    borderRadius: '1vh',
    '@media(max-width: 600px)': {
        width: '250px',
        left: '50%',
        transform: 'translate(-50%)'
    }
}

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
        <form onSubmit={handleSubmit}>
            <TextField
                size='small'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                inputRef={input}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
                variant='outlined'
                sx={searchStyles}
                InputProps={{
                    startAdornment:
                        <InputAdornment position='start'>
                            <Search />
                        </InputAdornment>
                }}
            />
            {search.length > 0 && focused &&
                <Grid sx={optionsStyles}>
                    {results.length > 0
                        ? results.map(result => (
                            <Card key={result.name} className={classes.card}>
                                <NextLink href={`/product/${result._id}`} passHref>
                                    <Link underline='none' onClick={() => setSearch('')}>
                                        <Grid container direction='row' alignItems='center' wrap='nowrap' style={{ paddingLeft: '10px', minHeight: '50px' }}>
                                            <img src={result.images[0]} alt='Not Found' height='40' width='40' />
                                            <Typography
                                                noWrap={true}
                                                variant='h6'
                                                component='h6'
                                                style={{ paddingLeft: '10px' }}
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