const { check } = require('express-validator')
require('dotenv').config()

const checkRequiredString = (field, name) => check(field)
    .exists().withMessage(`Поле ${name} обязательное`)
    .trim().not().isEmpty().withMessage(`Поле ${name} не может быть пустым`)
    .isString().withMessage(`Поле ${name} должно быть строкой`)

exports.validateUserGet = [
    check('email').normalizeEmail().isEmail().withMessage('Почта не верна')
]

exports.validateUserCreation = [
    checkRequiredString('role', 'роли').custom(role => {
        const roles = ['employee', 'owner', 'senior']
        return roles.includes(role)
    }).withMessage('Недопустимая роль'),
    check('email').exists().withMessage('Поле почты обязательное')
        .isEmail().withMessage('Неверный формат почты')
        .isString().withMessage('Поле должно быть строкой'),
    checkRequiredString('password', 'пароля').isLength({ min: 8, max: 20 }).withMessage('Слишком короткий пароль'),
    checkRequiredString('confirmPassword', 'повторного пароля')
        .custom(
            (value, { req }) => value == req.body.password
        ).withMessage('Пароли не совпадают'),
    checkRequiredString('name', 'имени')
        .isLength({ min: 1, max: 20 }).withMessage('Короткое имя'),
    checkRequiredString('surname', 'фамилии')
        .isLength({ min: 1, max: 20 }).withMessage('Короткая фамилия'),
    checkRequiredString('phone', 'телефона'),
    check('dob').optional().isDate().withMessage('Поле dob должно быть датой')
]

exports.validateUserLogin = [
    check('email').normalizeEmail().isEmail().withMessage('Почта или пароль не верны!'),
    check('password').trim().not().isEmpty().withMessage('Почта или пароль не верны!')
]