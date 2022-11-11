const mongoose = require('mongoose')
const { response } = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')

const User = require('../models/user')
const WebToken = require('../models/webtoken')
const ResetToken = require('../models/resetToken')

const { resError } = require('../utils/helper')

const { JWT_TOKEN_SECRET } = process.env

exports.getUserByEmail = async (req, res) => {
    const { email } = req.query
    const user = await User.findOne({ email })
        .select('role email name surname phone dob addreess')
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
    const { email } = req.body
    const emailFree = await User.isEmailFree(email)
    if (!emailFree)
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
    console.log(`Пользователь ${email} создан`)

    return res.json({
        success: true,
        user
    })
}

exports.userLogin = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user)
        return resError(res, 'Почта или пароль не верны', 401) // unathorized
    const matched = await user.comparePassword(password)
    if (!matched)
        return resError(res, 'Почта или пароль не верны', 401) // unathorized

    await WebToken.deleteMany({ owner: user._id })
    const tokenVal = jwt.sign({ owner: user._id }, JWT_TOKEN_SECRET)
    const { iat } = jwt.verify(tokenVal, JWT_TOKEN_SECRET)
    const wToken = await WebToken({
        owner: user._id,
        token: tokenVal,
        createdAt: iat
    })
    await wToken.save()

    return res.json({
        success: true,
        user,
        jwtToken: tokenVal
    })
}

exports.userLogout = async (req, res) => {
    const { _id } = req.user // from middlewares/validation/user.isLoggedIn()
    await WebToken.deleteMany({ owner: _id })

    return res.json({
        success: true
    })
}
