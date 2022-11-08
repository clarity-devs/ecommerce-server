const mongoose = require('mongoose')

const termSchema = mongoose.Schema({
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = termSchema
// module.exports = mongoose.model('Term', termSchema)