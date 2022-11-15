const express = require('express')

const { checkValidation, validateDeletion } = require('../middlewares/validation')
const { validateShopCreation } = require('../middlewares/validation/shop')
const { notEmployee } = require('../middlewares/verification/user')
const { shopCreate, shopDelete } = require('../controllers/shop')

const router = express.Router()

router.post('/create', validateShopCreation, checkValidation, notEmployee, shopCreate)
router.delete('/delete', validateDeletion, checkValidation, notEmployee, shopDelete)

module.exports = router