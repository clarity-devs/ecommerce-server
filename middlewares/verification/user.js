const User = require('../../models/user')
require('dotenv').config()
const WebToken = require('../../models/webtoken')
const { resError, getBearerToken } = require('../../utils/helper')
const jwt = require('jsonwebtoken')

const { JWT_TOKEN_SECRET } = process.env

exports.isLoggedIn = async (req, res, next) => {
    const jwtToken = getBearerToken(req)
    if (jwtToken == undefined) return resError(res, 'Вы не авторизованы')
    try {
        const { owner } = await jwt.verify(jwtToken, JWT_TOKEN_SECRET)
        const wToken = await WebToken.findOne({ owner }, {}, { sort: { 'createdAt': - 1 } })
        if (!wToken && jwtToken != wToken.token)
            return resError(res, 'Вы не авторизованы')
        const user = await User.findOne({ _id: owner })
        if (!user)
            return resError(res, 'Вы не авторизованы')

        req.user = user
        next()
    } catch (err) {
        return resError(res, 'Произошла ошибка при аутентификации')
    }
}

exports.notEmployee = async (req, res, next) => {
    exports.isLoggedIn(req, res, () => {
        const user = req.user
        if (!user.role || user.role == 'employee')
            return resError(res, 'Недостаточно полномочий')

        next()
    })
}