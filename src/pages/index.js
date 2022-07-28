import { useState, useEffect } from 'react'
import connectionDB from '../utils/db'
import Product from '../models/product'
import Category from '../models/category'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import { useDispatch } from '../context/StoreProvider'
import { actionsTypes } from '../context/StoreReducer'
import { Grid, FormControl, InputLabel, Select, MenuItem, Pagination } from '@mui/material'


export default function Home({ allProducts, allCategories }) {

  const [products, setProducts] = useState(allProducts)
  const [select, setSelect] = useState({
    name: '',
    price: '',
    category: ''
  });

  const [page, setPage] = useState(1);
  const productsPerPage = 12;
  const indexLastProducts = page * productsPerPage;
  const indexFirstProducts = indexLastProducts - productsPerPage;
  const currentProducts = products?.slice(indexFirstProducts, indexLastProducts);

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: actionsTypes.LOAD_PRODUCTS, payload: allProducts })
  }, [])

  function handleChange(event, value) {
    setPage(value);
  }

  function sortName(e) {
    setSelect({
      ...select,
      name: e.target.value,
      price: ''
    })
    setProducts(e.target.value === 'a-z'
      ? products.sort((a, b) => {
        if (a.name > b.name) return 1
        if (a.name < b.name) return -1
        return 0
      })
      : products.sort((a, b) => {
        if (a.name > b.name) return -1
        if (a.name < b.name) return 1
        return 0
      })
    )
    setPage(1);
  }

  function sortPrice(e) {
    setSelect({
      ...select,
      price: e.target.value,
      name: ''
    })
    setProducts(e.target.value === 'lower'
      ? products.sort((a, b) => a.price - b.price)
      : products.sort((a, b) => b.price - a.price)
    )
    setPage(1);
  }

  function filterCategory(e) {
    setSelect({
      category: e.target.value,
      name: '',
      price: ''
    })
    if (e.target.value === 'all') {
      setProducts(allProducts)
    } else {
      let productsFiltered = [];
      allProducts.forEach(product => {
        product.categories.forEach(category => {
          category.name === e.target.value && productsFiltered.push(product)
        })
      });
      setProducts(productsFiltered)
    }
    setPage(1);
  }

  return (
    <Layout>

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

        <FormControl variant='standard' style={{ width: 110, marginRight: '2vw' }}>
          <InputLabel>Categorias</InputLabel>
          <Select
            value={select.category}
            onChange={filterCategory}
          >
            <MenuItem value='all'>Todas</MenuItem>
            {allCategories?.map(category => (
              <MenuItem key={category._id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid
        container
        justifyContent='center'
        alignItems='center'
      >
        {currentProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </Grid>

      <Grid
        container
        justifyContent='center'
      >
        <Pagination
          count={Math.ceil(products?.length / productsPerPage)}
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

export async function getServerSideProps() {

  await connectionDB();

  const allProducts = await Product.find({}).populate('categories').lean();
  const allCategories = await Category.find({}).lean();

  return {
    props: {
      allProducts: JSON.parse(JSON.stringify(allProducts)),
      allCategories: JSON.parse(JSON.stringify(allCategories))
    }
  }
}