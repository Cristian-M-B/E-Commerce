import connectionDB from '../../utils/db'
import Review from '../../models/review'

export default async function handler(req, res) {
    await connectionDB();

    if (req.method === 'GET') {
        const reviews = await Review.find({}).populate('product').populate('user').lean();
        res.status(200).json(reviews);
    }

    if (req.method === 'POST') {
        const newReview = new Review({
            user: req.body.user,
            product: req.body.product,
            punctuation: req.body.punctuation,
            comment: req.body.comment,
            date: req.body.date
        })
        await newReview.save();
        const reviews = await Review.find({}).populate('product').populate('user').lean();
        res.status(200).json(reviews)
    }
}
