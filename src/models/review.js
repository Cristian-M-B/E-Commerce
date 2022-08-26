const { Schema, model, models } = require('mongoose')

const reviewSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    punctuation: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true
    },
    modified: {
        type: String
    }},
    {
        timestamps: false,
        versionKey: false
    }
)

const Review = models.Review || model('Review', reviewSchema)

module.exports = Review