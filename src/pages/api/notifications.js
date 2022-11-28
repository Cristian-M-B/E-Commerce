import connectionDB from '../../utils/db'
import Order from '../../models/order'
import axios from 'axios'
import { transporter, notification } from '../../utils/email'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const id = req.body.data.id
        const { data } = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`, {
            headers: {
                'Authorization': `Bearer ${process.env.ACCESS_TOKEN_MP}`
            }
        })
        await connectionDB()
        await Order.updateOne({ paymentID: id }, { paymentStatus: data.status })
        const order = await Order.findOne({ paymentID: id }).populate('user').lean()
        if (data.status === 'approved') {
            await transporter.sendMail(notification(order))
        }
        res.status(200).send('OK')
    }
}
