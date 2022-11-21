const mongoose = require('mongoose')

const Time = {
    hour: {
        type: Number,
        min: 0,
        max: 23,
        required: true
    },
    minute: {
        type: Number,
        min: 0,
        max: 59,
        default: 0,
        required: true
    }
}

const termSchema = mongoose.Schema({
    startTime: { type: Time, required: true },
    endTime: { type: Time, required: true },
    updatedAt: { type: Date, default: Date.now() },
    createdAt: { type: Date, default: Date.now() }
})

termSchema.pre('save', function (next) {
    this.updatedAt = Date.now()

    next()
})

module.exports = mongoose.model('Term', termSchema)