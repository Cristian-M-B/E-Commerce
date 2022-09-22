import connectionDB from '../../utils/db'
import Category from '../../models/category'

export default async function handler(req, res) {
    await connectionDB();

    if (req.method === 'POST') {
        const newCategory = new Category({ name: req.body.name });
        await newCategory.save();
        const listCategory = await Category.find({}).lean();
        res.status(200).json(listCategory);
    }

    if (req.method === 'PUT') {
        const { id, name } = req.body;
        await Category.findByIdAndUpdate(id, { name });
        const listCategory = await Category.find({}).lean();
        res.status(200).json(listCategory);
    }

    if (req.method === 'DELETE') {
        const { id } = req.query;
        await Category.findByIdAndDelete(id);
        const listCategory = await Category.find({}).lean();
        res.status(200).json(listCategory);
    }
}