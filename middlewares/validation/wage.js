const { check } = require('express-validator')

exports.validateWageCreation = [
    check('payment').exists().withMessage('Поле оплаты обязательное')
        .isDecimal().withMessage('Поле оплаты должно быть десятичным'),
    check('period').exists().withMessage('Поле периода обязательное')
        .isString().withMessage('Поле периода должно быть строкой')
        .custom(period => {
            const periods = ['monthly', 'daily', 'hourly']
            return periods.includes(period)
        }).withMessage('Недопустимый период'),
    check('bonus').optional().isDecimal().withMessage('Поле бонуса должно быть десятичным')
]