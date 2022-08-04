import mercadopago from 'mercadopago'

export default async function handler(req, res) {
    if (req.method === 'POST') {

        const items = req.body?.map(item => {
            return {
                id: item._id._id,
                title: item._id.name,
                description: item._id.description,
                picture_url: item._id.images[0],
                unit_price: item._id.price,
                quantity: item.quantity
            }
        })

        mercadopago.configure({
            access_token: process.env.ACCESS_TOKEN_MP
        })

        const preference = {
            items: items,
            auto_return: 'approved',
            back_urls: {
                success: 'http://localhost:3000/order/success',
                failure: 'http://localhost:3000/order/failure',
                pending: 'http://localhost:3000/order/pending'
            },
        };

        mercadopago.preferences
            .create(preference)
            .then(response => {
                res.status(200).json(response.body.init_point)
            })
            .catch(error => {
                console.log(error)
            })
    }
}