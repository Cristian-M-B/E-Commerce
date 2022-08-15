const { Schema, model, models } = require('mongoose')

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    document: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    image: {
        type: String
    },
    shippingData: {
        type: Object
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    cart: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: Number
    }]},
    {
        timestamps: false,
        versionKey: false
    }
)

const User = models.User || model('User', userSchema)

module.exports = User