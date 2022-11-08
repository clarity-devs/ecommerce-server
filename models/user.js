const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    dob: Date, // date of birth
    address: { 
        city: {
            type: String,
            required: true
        }, 
        street: {
            type: String,
            required: true
        } 
    },
    tokens: [mongoose.SchemaTypes.ObjectId],
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

// middleware activated when saved
userSchema.pre('save', next => {
    if (this.isModified('password')) {
        const hash = bcrypt.hash(this.password, 8)
        this.password = hash
    }
    next()
})

userSchema.methods.comparePassword = async password => {
    if (!password) throw new Error('Повторите пароль')

    try {
        const result = await bcrypt.compare(password, this.password)
        return result
    } catch (error) {
        console.log('Ошибка при сравнении паролей!', error.message)
    }
}

userSchema.statics.isEmailFree = async email => {
    if (!email) throw new Error('Поле email пустое')

    try {
        const user = await this.findOne({ email })

        if (user) return false
        return true
    } catch (err) {
        console.log('Ошибка в методе isEmailFree', error.message)
        return false
    }
}

userSchema.statics.isPhoneFree = async phone => {
    if (!phone) throw new Error('Поле phone пустое')

    try {
        const user = await this.findOne({ phone })

        if (user) return false
        return true
    } catch (err) {
        console.log('Ошибка в методе isEmailFree', error.message)
        return false
    }
}

module.exports = mongoose.model('User', userSchema)