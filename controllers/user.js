const mongoose = require('mongoose')
const { response } = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { validationResult } = require('express-validator')

const User = require('../models/user')
const ResetToken = require('../models/resetToken')

const { resError } = require('../utils/helper')

const { JWT_TOKEN_SECRET } = process.env

exports.getUserById = async (req, res) => {
    const { id } = req.params

    const user = await User.findOne({ _id: mongoose.Types.ObjectId(id) }).select('email name surname phone dob addreess')

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

    const user = await User.findOne({ email }).select('email name surname phone dob addreess')

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
    const errors = validationResult(req)
    if (!errors.isEmpty()) return resError(res, errors.errors[0].msg) // bad request

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return resError(res, 'Вы не авторизованы', 401) // unauthorized
    try {
        const { _id } = jwt.verify(token, JWT_TOKEN_SECRET)
        const requester = User.findOne({ _id })

        if (!requester)
            return resError(res, 'Вы не авторизованы', 401) // unauthorized

        if (requester.role && (requester.role == 'employee'))
            return resError(res, 'Недостаточно полномочий', 403) // forbidden
    } catch (err) {
        console.log(err.message)
        return resError(res, 'Произошла ошибка') // bad request
    }

    const { email } = req.body
    const userExists = await User.findOne({ email })
    if (userExists)
        return resError(res, 'Пользователь уже существует') // bad request

    const {
        role,
        password,
        name,
        surname,
        phone,
        dob,
        address
    } = req.body
    const user = await User({
        role,
        email,
        password,
        name,
        surname,
        phone,
        address,
        dob
    })
    await user.save()

    console.log(`user ${email} created`)
    return res.json({
        success: true,
        user
    })
}

exports.userLogin = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return resError(res, errors.errors[0].msg) // bad request

    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user)
        return resError(res, 'Почта или пароль не верны', 401) // unathorized
    const matched = await user.comparePassword(password)
    if (!matched)
        return resError(res, 'Почта или пароль не верны', 401) // unathorized

    const token = jwt.sign({ _id: user._id }, JWT_TOKEN_SECRET, {
        expiresIn: '1d'
    })

    return res.json({
        success: true,
        user,
        token
    })
}
