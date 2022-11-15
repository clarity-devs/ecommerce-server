const express = require('express')
const router = express.Router()
const { checkValidation, validateDeletion } = require('../middlewares/validation')
const { notEmployee } = require('../middlewares/verification/user')
const { shiftCreate, shiftDelete } = require('../controllers/shift')
const { validateShiftCreation } = require('../middlewares/validation/shift')
const { fieldsExist } = require('../middlewares/verification/shift')

router.post('/create', validateShiftCreation, checkValidation, fieldsExist, notEmployee, shiftCreate)
router.delete('/delete', validateDeletion, checkValidation, notEmployee, shiftDelete)

module.exports = router