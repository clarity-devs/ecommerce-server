const { Router } = require('express')

const {
    getAllUsers,
    getUserByEmail,
    userCreate,
    userDelete,
    userLogin,
    userLogout,
    userAuthenticate
} = require('../controllers/user')
const { checkValidation, validateDeletion } = require('../middlewares/validation')
const {
    validateUserGet,
    validateUserCreation,
    validateUserLogin,
} = require('../middlewares/validation/user')
const {
    notEmployee,
    isLoggedIn
} = require('../middlewares/verification/user')

const router = Router()

router.post('/get/all', notEmployee, getAllUsers)
router.get('/get/email', validateUserGet, checkValidation, getUserByEmail)

router.put('/create', validateUserCreation, checkValidation, notEmployee, userCreate)
router.delete('/delete', validateDeletion, checkValidation, notEmployee, userDelete)
router.post('/login', validateUserLogin, checkValidation, userLogin)
router.post('/logout', isLoggedIn, userLogout)
router.post('/authenticate', isLoggedIn, userAuthenticate)

module.exports = router