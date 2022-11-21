const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()

const { BCRYPT_SALT_ROUNDS } = process.env

const userSchema = new mongoose.Schema({
    // senior || employee || owner:
    role: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    phone: { type: String, required: true },
    dob: Date, // date of birth
    shifts: {
        type: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Shift',
            required: true
        }],
        required: true,
        default: []
    },
    updatedAt: { type: Date, default: Date.now() },
    createdAt: { type: Date, default: Date.now() }
})

// middleware activated when saved
userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.hash(this.password, parseInt(BCRYPT_SALT_ROUNDS), (err, hash) => {
            if (err)
                console.log(`Не удалось хэшировать пароль пользователя: `, this.email)

            this.password = hash
        })
    }

    this.updatedAt = Date.now()

    next()
})

userSchema.methods.comparePassword = async function (password) {
    try {
        const result = await bcrypt.compare(password, this.password)
        return result
    } catch (err) {
        console.log('Ошибка при проверке пароля:', err.message)
    }
}

userSchema.methods.getSafeInfo = function () {
    const { password, updatedAt, createdAt, shifts, ...safeUserInfo } = this._doc
    return safeUserInfo
}

userSchema.statics.isEmailFree = async function (email) {
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