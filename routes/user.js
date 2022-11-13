const express = require('express')

const {
    getUserByEmail,
    userCreate,
    userLogin,
    userLogout
} = require('../controllers/user')
const { checkValidation } = require('../middlewares/validation')
const {
    validateUserGet,
    validateUserCreation,
    validateUserLogin,
} = require('../middlewares/validation/user')
const {
    notEmployee,
    isLoggedIn
} = require('../middlewares/verification/user')

const router = express.Router()

router.get('/get', validateUserGet, checkValidation, getUserByEmail)

router.post('/create', validateUserCreation, checkValidation, notEmployee, userCreate)
router.post('/login', validateUserLogin, checkValidation, userLogin)
router.post('/logout', isLoggedIn, userLogout)

module.exports = router