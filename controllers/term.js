const Term = require('../models/term')
const { resError } = require('../utils/helper')

exports.termCreate = async (req, res) => {
    const fields = { startDate, endDate } = req.body
    const term = Term({ ...fields })
    return term.save().then(() => {
        console.log(`Срок от ${startDate} - ${endDate} был создан`)

        return res.json({ success: true })
    }).catch(() => resError(res, 'Не удалось создать срок', 500)) // Internal server error
}

exports.termDelete = async (req, res) => {
    const { _id } = req.body
    return Term.findByIdAndDelete(_id).then(doc => {
        const { startDate, endDate } = doc
        console.log(`Удален срок от ${startDate} - ${endDate}`)

        return res.json({ success: true })
    }).catch(() => resError(res, 'Не удалось удалить срок'))
}