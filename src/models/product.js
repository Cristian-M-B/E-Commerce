const { Schema, model, models } = require('mongoose')

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: [{
        type: String
    }],
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }]},
    {
        timestamps: false,
        versionKey: false
    }
)

const Product = models.Product || model('Product', productSchema)

module.exports = Product