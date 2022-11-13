const { check } = require('express-validator')
const User = require('../../models/user')
require('dotenv').config()
const ResetToken = require('../../models/resetToken')
const { isValidObjectId } = require('mongoose')
const { resError } = require('../../utils/helper')

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
    checkRequiredString('password', 'пароль').isLength({ min: 8, max: 20 }).withMessage('Слишком короткий пароль'),
    checkRequiredString('confirmPassword', 'пароль').custom((value, { req }) => {
        if (value !== req.body.password) {
            return false
        }
        return true
    }).withMessage('Пароли не совпадают'),
    checkRequiredString('name', 'имя').isLength({ min: 1, max: 20 }).withMessage('Короткое имя'),
    checkRequiredString('surname', 'имя').isLength({ min: 1, max: 20 }).withMessage('Короткая фамилия'),
    checkRequiredString('phone', 'телефон'),
    check('dob').optional().isDate().withMessage('Поле dob должно быть датой')
]

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