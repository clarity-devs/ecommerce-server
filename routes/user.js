const express = require('express')
const router = express.Router()
const User = require('../models/user')

const { userCreate, userLogin } = require('../controllers/user')
const { validateUserCreation } = require('../middlewares/validation/user')

router.post('/create', validateUserCreation, userCreate)
router.post('/login', userLogin)

module.exports = router