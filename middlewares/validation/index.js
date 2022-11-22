const { check, validationResult } = require('express-validator')
const { resError } = require('../../utils/helper')

exports.checkValidation = (req, res, next) => {
    const valRes = validationResult(req)

    if (valRes.isEmpty()) return next()
    return resError(res, valRes.errors[0].msg)
}

exports.validateDeletion = [
    check('_id').exists().withMessage('Поле идентификатора обязательное')
]