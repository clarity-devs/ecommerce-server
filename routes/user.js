const { Router } = require('express')
const express = require('express')

const {
    getAllUsers,
    getUserByEmail,
    userCreate,
    userLogin,
    userLogout,
    userAuthenticate
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

router.post('/get/all', notEmployee, getAllUsers)
router.get('/get/email', validateUserGet, checkValidation, getUserByEmail)

router.put('/create', validateUserCreation, checkValidation, notEmployee, userCreate)
router.post('/login', validateUserLogin, checkValidation, userLogin)
router.post('/logout', isLoggedIn, userLogout)
router.post('/authenticate', isLoggedIn, userAuthenticate)

module.exports = router