const { check } = require('express-validator')

exports.validateShopCreation = [
    check('name').optional().isString().withMessage(`Название магазина должно быть строкой`),
    check('address').exists().withMessage('Поле адреса обязательное'),
    check('address.city').trim().not().isEmpty().withMessage(`Поле города обязательное`)
        .isString().withMessage(`Поле города должно быть строкой`),
    check('address.street').trim().not().isEmpty().withMessage(`Поле улицы обязательное`)
        .isString().withMessage(`Поле улицы должно быть строкой`),
]