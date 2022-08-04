import connectionDB from '../../utils/db'
import Order from '../../models/order'

export default async function handler(req, res) {
    await connectionDB();

    if(req.method === 'POST') {
        const newOrder = new Order({
            user: req.body.userID,
            products: req.body.products,
            date: req.body.currentDate,
            paymentID: req.body.mp.paymentID,
            paymentStatus: req.body.mp.paymentStatus,
            paymentType: req.body.mp.paymentType,
            preferenceID: req.body.mp.preferenceID,
            deliveryMode: req.body.deliveryMode
        })
        const orderSaved = await newOrder.save();
        res.status(200).json(orderSaved);
    }
}
