const express = require('express')
const router = express.Router()

const {
    getUsers,
    getUserById,
    getUserByEmail,
    userCreate,
    userLogin,
} = require('../controllers/user')
const {
    checkValidation,
    validateUserGet,
    validateUserCreation,
    validateUserLogin
} = require('../middlewares/validation/user')

router.get('', getUsers)
router.get('/get', validateUserGet, checkValidation, getUserByEmail)

router.post('/create', validateUserCreation, checkValidation, userCreate)
router.post('/login', validateUserLogin, checkValidation, userLogin)

module.exports = router