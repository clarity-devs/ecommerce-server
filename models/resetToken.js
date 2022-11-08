const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
        expires: 3600,
        default: Date.now()
    }
})

resetTokenSchema.pre('save', async next => {
    if (this.isModified('token')) {
        const hash = bcrypt.hash(this.token, 8)
        this.token = hash
    }

    next()
})

resetTokenSchema.methods.compareToken = token => token === this.token

module.exports = mongoose.model('ResetToken', resetTokenSchema)