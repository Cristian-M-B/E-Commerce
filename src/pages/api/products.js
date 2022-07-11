import connectionDB from '../../utils/db'
import Product from '../../models/product'

export default async function handler(req, res) {
  
  await connectionDB();
  const allProducts = await Product.find({}).lean();
  res.status(200).json(allProducts);
}
