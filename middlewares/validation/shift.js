const { check } = require('express-validator')

exports.validateShiftCreation = [
    check('paymentDate').optional().isDate()
]