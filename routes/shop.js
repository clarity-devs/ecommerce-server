const express = require('express')

const { checkValidation } = require('../middlewares/validation')
const { validateShopCreation, validateShopDeletion } = require('../middlewares/validation/shop')
const { notEmployee } = require('../middlewares/verification/user')
const { shopCreate, shopDelete } = require('../controllers/shop')

const router = express.Router()

router.post('/create', validateShopCreation, checkValidation, notEmployee, shopCreate)
router.post('/delete', validateShopDeletion, checkValidation, notEmployee, shopDelete)

module.exports = router