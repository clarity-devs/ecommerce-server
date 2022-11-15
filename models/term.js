const mongoose = require('mongoose')

const termSchema = mongoose.Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    updatedAt: { type: Date, default: Date.now() },
    createdAt: { type: Date, default: Date.now() }
})

termSchema.pre('save', function (next) {
    this.updatedAt = Date.now()

    next()
})

module.exports = mongoose.model('Term', termSchema)