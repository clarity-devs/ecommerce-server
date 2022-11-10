const express = require('express')
const router = express.Router()

const {
    getUsers,
    getUserById,
    getUserByEmail,
    userCreate,
    userLogin,
} = require('../controllers/user')
const { validateUserCreation } = require('../middlewares/validation/user')

router.get('', getUsers)
router.get('/id/:id', getUserById)
router.get('/email/:email', getUserByEmail)

router.post('/create', validateUserCreation, userCreate)
router.post('/login', userLogin)

module.exports = router