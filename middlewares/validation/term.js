const { check } = require('express-validator')

const checkRequiredTime = (field, name) => check(field)
    .exists().withMessage(`Поле ${name} обязательное`)
    .custom(time => {
        const { hour, minute } = time
        if (!(hour && minute))
            return false

        if (!(0 <= hour <= 23 && 0 <= minute <= 59))
            return false

        return true
    }).withMessage(`Неверный формат ${name}`)

exports.validateTermCreation = [
    checkRequiredTime('startTime', 'начального времени'),
    checkRequiredTime('endTime', 'конечного времени')
]