const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Comment', commentSchema)