const express = require('express')
const router = express.Router()

const {
    getUsers,
    getUserById,
    getUserByEmail,
    userCreate,
    userLogin,
    userLogout
} = require('../controllers/user')
const {
    checkValidation,
    validateUserGet,
    validateUserCreation,
    validateUserLogin,
    notEmployee,
    isLoggedIn
} = require('../middlewares/validation/user')

router.get('', getUsers)
router.get('/get', validateUserGet, checkValidation, getUserByEmail)

router.post('/create', validateUserCreation, checkValidation, notEmployee, userCreate)
router.post('/login', validateUserLogin, checkValidation, userLogin)
router.post('/logout', isLoggedIn, userLogout)

module.exports = router