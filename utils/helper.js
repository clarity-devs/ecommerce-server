exports.resError = (res, message, status = 400) => {
    console.log('resError', message)
    res.status(status).json({ success: false, message })
}

exports.getBearerToken = req => {
    const authHeader = req.headers['authorization']
    const wToken = authHeader && authHeader.split(' ')[1]
    return wToken
}