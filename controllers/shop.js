const Shop = require('../models/shop')

exports.shopCreate = async (req, res) => {
    const fields = { name, address, } = req.body
    const shop = Shop({ ...fields })
    return shop.save().then(() => {
        const { street, city } = address
        const text = name ?
            `Магазин по ${name} был создан` :
            `Магазин по адресу ${street}, г. ${city} был создан`
        console.log(text)

        return res.json({
            success: true
        })
    }).catch(err => res.json({
        success: false,
        message: err
    }))
}

exports.shopDelete = async (req, res) => {
    const { _id } = req.body
    return Shop.findByIdAndDelete(_id).then(doc => {
        const { name, address } = doc
        const text = name ?
            `Магазин по ${name} был удален` :
            `Магазин по адресу ${address.street}, г. ${address.city} был удален`
        console.log(text)

        return res.json({
            success: true,
        })
    }).catch(() => res.json({
        success: false,
        message: 'Не удалось удалить магазин'
    }))
}