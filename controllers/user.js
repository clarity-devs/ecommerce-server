const jwt = require('jsonwebtoken')
require('dotenv').config()

const User = require('../models/user')
const WebToken = require('../models/webtoken')

const { resError } = require('../utils/helper')

const { JWT_TOKEN_SECRET } = process.env

exports.getUserByEmail = async (req, res) => {
    const { email } = req.query
    return User.findOne({ email }).select('role email name surname phone dob')
        .then(user => {
            if (user.role != 'employee')
                return resError(res, 'Нет доступа', 403) // forbidden
            return res.json({
                success: true,
                user
            })
        }).catch(() => resError(res, 'Пользователь не найден')) // bad request
}

exports.userCreate = async (req, res) => {
    const { email } = req.body
    const emailFree = await User.isEmailFree(email)
    if (!emailFree)
        return resError(res, 'Пользователь уже существует') // bad request

    const fields = { role, password, name, surname, phone, dob } = req.body
    const user = await User({ ...fields })
    return user.save().then(() => {
        console.log(`Пользователь ${email} создан`)

        return res.json({
            success: true,
            user
        })
    }).catch(() => res.json({
        success: false,
        message: 'Не удалось'
    }))
}

exports.userLogin = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user)
        return resError(res, 'Почта или пароль не верны', 401) // unathorized
    const matched = await user.comparePassword(password)
    if (!matched)
        return resError(res, 'Почта или пароль не верны', 401) // unathorized

    await WebToken.deleteMany({ owner: user._id })
    const tokenVal = jwt.sign({ owner: user._id }, JWT_TOKEN_SECRET)
    const { iat } = jwt.verify(tokenVal, JWT_TOKEN_SECRET)
    const wToken = await WebToken({
        owner: user._id,
        token: tokenVal,
        createdAt: iat
    })

    return wToken.save().then(() => res.json({
        success: true,
        user,
        jwtToken: tokenVal
    })).catch(() => resError(res, 'Не удалось авторизоваться'))
}

exports.userLogout = async (req, res) => {
    const { _id } = req.user // from middlewares/validation/user.isLoggedIn()
    await WebToken.deleteMany({ owner: _id })

    return res.json({
        success: true
    })
}
