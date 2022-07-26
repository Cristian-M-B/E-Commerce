import connectionDB from '../../utils/db'
import User from '../../models/user'

export default async function handler(req, res) {
    await connectionDB();
    const { email, password } = req.body

    if (req.method === 'GET') {
        const users = await User.find({}).populate('favorites').lean();
        res.status(200).json(users);
    }

    if (req.method === 'POST') {
        if (req.query.login) {
            const user = await User.findOne({ email, password }).populate('favorites').lean();
            res.status(200).json(user);
        } else if (req.query.favorite) {
            const update = await User.updateOne(
                { _id: req.query.user },
                { $addToSet: { favorites: [req.query.favorite] } }
            );
            const user = await User.findById(req.query.user).populate("favorites").lean();
            res.status(200).json(user.favorites)
        } else {
            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                document: req.body.document,
                email: req.body.email,
                password: req.body.password
            })
            const userSaved = await newUser.save();
            res.status(200).json(userSaved);
        }
    }

    if (req.method === 'DELETE') {
        if (req.query.favorite) {
            const update = await User.updateOne(
                { _id: req.query.user },
                { $pull: { favorites: req.query.favorite } }
            );
            const user = await User.findById(req.query.user).populate("favorites").lean();
            res.status(200).json(user.favorites)
        }
    }
}