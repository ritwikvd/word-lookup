module.exports = (err, req, res, next) => {
    console.log(err.stack);
    res.status(err.response? err.response.status: null || 500).json({ success: false, error: err.message });
};
