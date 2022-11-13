const { validationResult } = require('express-validator')
const { resError } = require('../../utils/helper')

exports.checkValidation = (req, res, next) => {
    const valRes = validationResult(req)
    if (!valRes.isEmpty()) return resError(res, valRes.errors[0].msg) // bad request

    next()
}