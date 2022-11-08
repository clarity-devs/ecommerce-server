const mongoose = require('mongoose')

const shopSchema = mongoose.Schema({
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

module.exports = shopSchema
// module.exports = mongoose.model('Shop', shopSchema)