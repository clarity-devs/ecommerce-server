exports.sendError = (res, error, status = 400) =>
    res.status(status).json({ success: false, error })