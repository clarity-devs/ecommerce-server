const jwt = require('jsonwebtoken')

const User = require('../models/user')
const { sendError } = require('../utils/helper')
const ResetToken = require('../models/resetToken')
const { response } = require('express')

exports.userCreate = async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return sendError(res, 'Необходимо авторизоваться как старший продавец')

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err)

        if (err) return 
    })

    const {
        role,
        email,
        password,
        firstName,
        lastName,
        phone,
        dob,
        address
    } = req.body
    const user = await User({
        role,
        email,
        password,
        firstName,
        lastName,
        phone,
        address,
        dob
    })
    await user.save()

    return res.json({
        success: true,
        user
    })
}

exports.userLogin = async (req, res) => {

}