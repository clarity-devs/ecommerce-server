const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Task', taskSchema)