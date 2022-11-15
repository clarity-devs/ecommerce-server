const Wage = require('../models/wage')
const { resError } = require('../utils/helper')

exports.wageCreate = async (req, res) => {
    const fields = { payment, period, bonus } = req.body
    const wage = Wage({ ...fields })
    return wage.save().then(() => {
        console.log(`Добавлен новый зарплатный план в ${payment} тг.`)
        return res.json({
            success: true,
        })
    }).catch(() => resError(res, 'Не удалось создать зарплатный план'))
}

exports.wageDelete = async (req, res) => {
    const fields = { _id } = req.body
    return Wage.findByIdAndDelete(_id).then(doc => {
        const { payment } = doc
        console.log(`Зарплатный план в ${payment} тг. был удален`)

        return res.json({
            success: true
        })
    }).catch(() => resError(res, 'Не удалось удалить зарплатный план'))
}