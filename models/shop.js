const mongoose = require('mongoose')

const shopSchema = mongoose.Schema({
    name: String,
    address: {
        type: {
            city: {
                type: String,
                required: true
            },
            street: {
                type: String,
                required: true
            }
        },
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

shopSchema.pre('save', function (next) {
    this.updatedAt = Date.now()

    next()
})

module.exports = mongoose.model('Shop', shopSchema)