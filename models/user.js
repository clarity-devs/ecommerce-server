const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()

const { BCRYPT_SALT_ROUNDS } = process.env

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    }, // senior || employee || owner
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    dob: Date, // date of birth
    address: {
        type: {
            city: {
                type: String,
                required: true
            },
            street: {
                type: String,
                required: true
            }
        },
        required: false
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
userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.hash(this.password, parseInt(BCRYPT_SALT_ROUNDS), (err, hash) => {
            if (err)
                throw new Error('Не удалось хэшировать пароль')

            this.password = hash
        })
    }
    next()
})

userSchema.methods.comparePassword = password => {
    bcrypt.compare(password, this.password, (err, result) => {
        if (err)
            throw new Error(`Не удалось проверить пароль`)

        return result
    })
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