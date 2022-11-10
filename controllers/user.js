const mongoose = require('mongoose')
const { response } = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const User = require('../models/user')
const ResetToken = require('../models/resetToken')

const { sendError } = require('../utils/helper')

const { JWT_TOKEN_SECRET } = process.env

exports.getUserById = async (req, res) => {
    const { id } = req.params
    console.log(id)

    const user = await User.findOne({ _id: mongoose.Types.ObjectId(id) })

    if (!user)
        return res.json({
            success: false,
            message: 'Пользователь не найден'
        })

    if (user.role != 'employee')
        return res.json({
            success: false,
            message: 'Нет доступа'
        })

    return res.json({
        success: true,
        user
    })
}

exports.getUserByEmail = async (req, res) => {
    const { email } = req.params
    console.log(email)

    const user = await User.findOne({ email })

    if (!user)
        return res.json({
            success: false,
            message: 'Пользователь не найден'
        })

    if (user.role != 'employee')
        return res.json({
            success: false,
            message: 'Нет доступа'
        })

    return res.json({
        success: true,
        user
    })
}

exports.getUsers = async (req, res) => {
    const users = await User.find({ role: 'employee' }).select('email name surname phone dob addreess')

    return res.json({
        success: true,
        users
    })
}

exports.userCreate = async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return sendError(res, '', 401) // unauthorized

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err)

        if (err) return sendError(res, '', 403) // forbidden

        next()
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
    const { email, password } = req.body

    const wrongEmailOrPassword = sendError(res, 'Почта или пароль не верны', 401) // unathorized
    const user = await User.findOne({ email })
    if (!user)
        return wrongEmailOrPassword
    const matched = await user.comparePassword(password)
    if (!matched)
        return wrongEmailOrPassword

    const token = jwt.sign({ id: user._id }, JWT_TOKEN_SECRET, {
        expiresIn: '1d'
    })
    return res.json(token)
}
