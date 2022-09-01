const { Schema, model, models } = require('mongoose')
import User from './user'

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    products: {
        type: Array,
        required: true,
    },
    deliveryMode: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true,
    },
    paymentID: {
        type: String,
        required: true,
        unique: true
    },
    paymentStatus: {
        type: String,
        required: true
    },
    paymentType: {
        type: String
    },
    preferenceID: {
        type: String
    }},
    {
        timestamps: false,
        versionKey: false
    }
)

const Order = models.Order || model('Order', orderSchema)

module.exports = Order