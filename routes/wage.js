const express = require('express')
const router = express.Router()

const { wageCreate, wageDelete } = require('../controllers/wage')
const { validateWageCreation } = require('../middlewares/validation/wage')
const { checkValidation, validateDeletion } = require('../middlewares/validation')
const { notEmployee } = require('../middlewares/verification/user')

router.post('/create', validateWageCreation, checkValidation, notEmployee, wageCreate)
router.delete('/delete', validateDeletion, checkValidation, notEmployee, wageDelete)

module.exports = router