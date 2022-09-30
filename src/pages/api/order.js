import connectionDB from '../../utils/db'
import Order from '../../models/order'
import { transporter, order } from '../../utils/email'

export default async function handler(req, res) {
    await connectionDB();

    if (req.method === 'POST') {
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
        const myOrder = await Order.findById(orderSaved._id).populate('user').lean();
        transporter.sendMail(order(myOrder))
        res.status(200).json(orderSaved);
    }

    if (req.method === 'PUT') {
        await Order.findByIdAndUpdate(req.body.id, { paymentStatus: req.body.status })
        const listOrders = await Order.find({}).populate('user').lean()
        res.status(200).json(listOrders)
    }
}
