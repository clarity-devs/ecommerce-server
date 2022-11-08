const mongoose = require('mongoose')

const wageSchema = mongoose.Schema({
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = wageSchema
// module.exports = mongoose.model('Wage', wageSchema)