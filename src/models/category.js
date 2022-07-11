const { Schema, model, models } = require('mongoose')

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }},
    {
        timestamps: false,
        versionKey: false
    }
)

const Category = models.Category || model('Category', categorySchema)

module.exports = Category