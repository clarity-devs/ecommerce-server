exports.resError = (res, message, status = 400) => {
    console.log('resError', message)
    res.status(status).json({ success: false, message })
}