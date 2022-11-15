const { Decimal128 } = require('mongodb')
const mongoose = require('mongoose')

const wageSchema = mongoose.Schema({
    payment: { type: Decimal128, required: true },
    // monthly | daily | hourly
    period: { type: String, required: true },
    bonus: Decimal128,
    updatedAt: { type: Date, default: Date.now() },
    createdAt: { type: Date, default: Date.now() }
})

wageSchema.pre('save', function (next) {
    this.updatedAt = Date.now()

    next()
})

module.exports = mongoose.model('Wage', wageSchema)