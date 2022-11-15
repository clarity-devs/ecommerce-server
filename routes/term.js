const express = require('express')
const router = express.Router()

const { termCreate, termDelete } = require('../controllers/term')
const { checkValidation, validateDeletion } = require('../middlewares/validation')
const { validateTermCreation } = require('../middlewares/validation/term')
const { notEmployee } = require('../middlewares/verification/user')

router.post('/create', validateTermCreation, checkValidation, notEmployee, termCreate)
router.delete('/delete', validateDeletion, checkValidation, notEmployee, termDelete)

module.exports = router