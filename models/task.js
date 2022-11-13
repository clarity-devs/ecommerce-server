const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    completed: { type: Boolean, default: false },
    deadline: Date,
    performers: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Comment' }],
    updatedAt: { type: Date, default: Date.now() },
    createdAt: { type: Date, default: Date.now() }
})

taskSchema.pre('save', function (next) {
    this.updatedAt = Date.now()

    next()
})

module.exports = mongoose.model('Task', taskSchema)