import connectionDB from '../../utils/db'
import Order from '../../models/order'
import axios from 'axios'
import { transporter, notification } from '../../utils/email'

export default async function handler(req, res) {
    const id = req.body?.data?.id
    if (id) {
        const { data } = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`, {
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN_MP}`
            }
        })
        await connectionDB()
        await Order.updateOne({ paymentID: id }, { paymentStatus: data.status })
        const order = await Order.findOne({ paymentID: id }).populate('user').lean()
        if (order) {
            transporter.sendMail(notification(order))
        }
    }
    res.status(200).send('OK')
}