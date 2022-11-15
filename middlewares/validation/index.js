const { check, validationResult } = require('express-validator')
const { resError } = require('../../utils/helper')

exports.checkValidation = (req, res, next) => {
    const valRes = validationResult(req)
    console.log(valRes.errors[0])
    if (!valRes.isEmpty()) return resError(res, valRes.errors[0].msg) // bad request

    next()
}

exports.validateDeletion = [
    check('_id').exists().withMessage('Поле идентификатора обязательное')
]