exports.resError = (res, message) => {
    console.log('resError', message)
    res.json({ success: false, message })
}

exports.getBearerToken = req => {
    const authHeader = req.headers['authorization']
    const wToken = authHeader && authHeader.split(' ')[1]
    return wToken
}