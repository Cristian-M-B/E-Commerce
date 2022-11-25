import mercadopago from 'mercadopago'

export default async function handler(req, res) {
    if (req.method === 'POST') {

        const { cart, shipment, userInfo } = req.body

        const items = cart.map(item => {
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
            shipments: {
                cost: shipment,
                mode: 'not_specified'
            },
            payment_methods: {
                excluded_payment_types: [
                    { id: 'ticket' }
                ]
            },
            payer: {
                name: userInfo.firstName,
                surname: userInfo.lastName,
                email: userInfo.email,
                identification: {
                    type: 'DNI',
                    number: userInfo.document
                }
            },
            // auto_return: 'approved',
            back_urls: {
                success: process.env.BACK_URL_SUCCESS,
                failure: process.env.BACK_URL_FAILURE,
                pending: process.env.BACK_URL_PENDING
            },
            notification_url: 'https://tecnocommerce.vercel.app/api/notifications'
        };

        mercadopago.preferences
            .create(preference)
            .then(response => {
                // res.status(200).json(response.body.init_point)
                res.status(200).json(response.body.id)
            })
            .catch(error => {
                console.log(error)
            })
    }
}