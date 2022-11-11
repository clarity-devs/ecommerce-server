const { check, validationResult } = require('express-validator')
const User = require('../../models/user')
require('dotenv').config()
const WebToken = require('../../models/webtoken')
const ResetToken = require('../../models/resetToken')
const { isValidObjectId } = require('mongoose')
const { resError, getBearerToken } = require('../../utils/helper')
const jwt = require('jsonwebtoken')

const { JWT_TOKEN_SECRET } = process.env

const checkRequiredString = (field, name) => check(field)
    .trim().not().isEmpty().withMessage(`Поле "${name}" обязательное`)
    .isString().withMessage(`Поле "${name}" должно быть строкой`)

exports.validateUserGet = [
    check('email').normalizeEmail().isEmail().withMessage('Почта не верна')
]

exports.validateUserCreation = [
    checkRequiredString('role', 'роль').custom((value, { req }) => {
        const roles = ['employee', 'owner', 'senior']
        if (!roles.includes(value)) {
            return false
        }
        return true
    }).withMessage('Недопустимая роль'),
    check('email').normalizeEmail().toLowerCase().isEmail().withMessage('Неверный формат почты').isString().withMessage('Поле должно быть строкой'),
    checkRequiredString('password', 'пароль').isLength({ min: 8, max: 20 }).withMessage('Короткий пароль'),
    checkRequiredString('confirmPassword', 'пароль').custom((value, { req }) => {
        if (value !== req.body.password) {
            return false
        }
        return true
    }).withMessage('Пароли не совпадают'),
    checkRequiredString('name', 'имя').isLength({ min: 1, max: 20 }).withMessage('Короткое имя'),
    checkRequiredString('surname', 'имя').isLength({ min: 1, max: 20 }).withMessage('Короткая фамилия'),
    checkRequiredString('phone', 'телефон'),
    check('dob').optional().trim().not().isEmpty().withMessage('Поле "дата рождения" обязательное').isString().withMessage('Поле "дата рождения" должно быть строкой')
]

exports.checkValidation = (req, res, next) => {
    const valRes = validationResult(req)
    if (!valRes.isEmpty()) return resError(res, valRes.errors[0].msg) // bad request

    return next()
}

exports.validateUserLogin = [
    check('email').normalizeEmail().isEmail().withMessage('Почта или пароль не верны!'),
    check('password').trim().not().isEmpty().withMessage('Почта или пароль не верны!')
]

exports.validateResetToken = async (req, res, next) => {
    const { token, id } = req.query

    if (!token || !id) return resError(res, 'Невалидный запрос!')
    if (!isValidObjectId(id)) return resError(res, 'Невалидный пользователь!')

    const user = await User.findById(id)
    if (!user) return resError(res, 'Пользователь не найден!')

    const resetToken = await ResetToken.findOne({ owner: user._id })
    if (!resetToken) return resError(res, 'Токен не найден!')

    const isValid = await resetToken.compareToken(token)
    if (!isValid) return resError(res, 'Токен не валидный!')

    req.user = user
    next()
}

exports.isLoggedIn = async (req, res, next) => {
    const jwtToken = getBearerToken(req)
    if (jwtToken == undefined) return resError(res, 'Вы не авторизованы', 401) // unauthorized
    try {
        const { owner } = await jwt.verify(jwtToken, JWT_TOKEN_SECRET)
        const wToken = await WebToken.findOne({ owner }, {}, { sort: { 'createdAt': - 1 } })
        if (!wToken && jwtToken != wToken.token)
            return resError(res, 'Вы не авторизованы', 401) // unauthorized
        const user = await User.findOne({ _id: owner })
        if (!user)
            return resError(res, 'Вы не авторизованы', 401) // unauthorized

        req.user = user
        next()
    } catch (err) {
        return resError(res, 'Произошла ошибка') // bad request
    }
}

exports.notEmployee = async (req, res, next) => {
    exports.isLoggedIn(req, res, () => {
        const user = req.user
        if (!user.role || user.role == 'employee')
            return resError(res, 'Недостаточно полномочий', 403) // forbidden

        next()
    })
}