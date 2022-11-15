const { check } = require('express-validator')

const checkRequiredDate = (field, name) => check(field)
    .exists().withMessage(`Поле ${name} обязательное`)
    .custom(value => {
        try {
            const date = new Date(value)
            return date instanceof Date && !isNaN(date)
        } catch (e) {
            return false
        }
    }).withMessage(`Неверный формат поля ${name}`)
exports.validateTermCreation = [
    checkRequiredDate('startDate', 'начальной даты'),
    checkRequiredDate('endDate', 'конечной даты')
]