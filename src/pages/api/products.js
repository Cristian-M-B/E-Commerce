import connectionDB from '../../utils/db'
import Product from '../../models/product'

export default async function handler(req, res) {
  await connectionDB();

  if (req.method === 'GET') {
    const allProducts = await Product.find({}).lean();
    res.status(200).json(allProducts);
  }

  if (req.method === 'POST') {
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      categories: req.body.categories,
      images: req.body.images
    })
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct)
  }

  if (req.method === 'PUT') {
    const { id } = req.query
    if (req.query.subtractStock) {
      const product = await Product.findById(id)
      await Product.findByIdAndUpdate(id, { stock: product.stock - req.body.subtractStock })
      await Product.findById(id).lean()
      res.status(200)
    } else if (req.query.addStock) {
      const product = await Product.findById(id)
      await Product.findByIdAndUpdate(id, { stock: product.stock + req.body.addStock })
      await Product.findById(id).lean()
      res.status(200)
    } else {
      await Product.findByIdAndUpdate(id, { ...req.body })
      const updatedProduct = await Product.findById(id).lean()
      res.status(200).json(updatedProduct)
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    await Product.findByIdAndDelete(id);
    const listProduct = await Product.find({}).lean();
    res.status(200).json(listProduct);
  }
}
