const mongoose = require('mongoose')

const shiftSchema = mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    shop: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Shop',
        required: true
    },
    wage: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Wage',
        required: true
    },
    term: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Term',
        required: true
    },
    paymentDate: { type: Date, default: null },
    updatedAt: { type: Date, default: Date.now() },
    createdAt: { type: Date, default: Date.now() }
})

shiftSchema.pre('save', function (next) {
    this.updatedAt = Date.now()

    next()
})


module.exports = mongoose.model('Shift', shiftSchema)