const mongoose = require('mongoose')
const shopSchema = require('./shop')
const wageSchema = require('./wage')
const termSchema = require('./term')

const shiftSchema = mongoose.Schema({
    shop: {
        type: shopSchema,
        required: true
    },
    wage: {
        type: wageSchema,
        required: true
    },
    term: {
        type: termSchema,
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

module.exports = mongoose.model('Shift', shiftSchema)