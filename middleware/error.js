module.exports = (err, req, res, next) => {
    console.log(err.stack);

    res.status(err.response.status || 500).json({ success: false, error: err.message });
};
