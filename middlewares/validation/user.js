const { check, validationResult } = require('express-validator')
const User = require('../../models/user')
const ResetToken = require('../../models/resetToken')
const { isValidObjectId } = require('mongoose')
const { sendError } = require('../../utils/helper')

const checkRequiredString = field => check(field)
    .trim().not().isEmpty().withMessage(`Поле обязательное`)
    .isString().withMessage(`Поле должно быть строкой`)

exports.validateUserCreation = [
    checkRequiredString('role'),
    check('email').normalizeEmail().isEmail().withMessage('Неверный формат почты').isString().withMessage('Поле должно быть строкой'),
    checkRequiredString('password').isLength({ min: 8, max: 20 }).withMessage('Короткий пароль'),
    checkRequiredString('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password)
            throw new Error('Пароли не совпадают')
        return true
    }),
    checkRequiredString('firstName').isLength({ min: 1, max: 20 }).withMessage('Короткое имя'),
    checkRequiredString('lastName').isLength({ min: 1, max: 20 }).withMessage('Короткая фамилия'),
    checkRequiredString('phone'),
    check('address').optional(),
    checkRequiredString('address.city'),
    checkRequiredString('address.street'),
    check('dob').optional().trim().not().isEmpty().withMessage('Поле обязательное').isString().withMessage('Поле должно быть строкой')
]

exports.userValidation = (req, res, next) => {
    const result = validationResult(req).array()

    if (!result.length) return next()

    const error = result[0].msg
    res.json({
        success: false,
        message: error
    })
}

exports.validateUserLogin = [
    check('email').normalizeEmail().isEmail().withMessage('Почта или пароль не верны!'),
    check('password').trim().not().isEmpty().withMessage('Почта или пароль не верны!')]

exports.validateResetToken = async (req, res, next) => {
    const { token, id } = req.query

    if (!token || !id) return sendError(res, 'Невалидный запрос!')
    if (!isValidObjectId(id)) return sendError(res, 'Невалидный пользователь!')

    const user = await User.findById(id)
    if (!user) return sendError(res, 'Пользователь не найден!')

    const resetToken = await ResetToken.findOne({ owner: user._id })
    if (!resetToken) return sendError(res, 'Токен не найден!')

    const isValid = await resetToken.compareToken(token)
    if (!isValid) return sendError(res, 'Токен не валидный!')

    req.user = user
    next()
}