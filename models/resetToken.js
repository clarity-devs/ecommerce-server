const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()

const { BCRYPT_SALT } = process.env

const resetTokenSchema = new mongoose.Schema({
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        expires: '5h',
        default: Date.now()
    }
})

resetTokenSchema.pre('save', async next => {
    if (this.isModified('token')) {
        const hash = bcrypt.hash(this.token, BCRYPT_SALT)
        this.token = hash
    }

    next()
})

resetTokenSchema.methods.compareToken = token => token === this.token

module.exports = mongoose.model('ResetToken', resetTokenSchema)