const whiteList = require('../config/whiteList');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (whiteList.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
        res.header("Access-Control-Expose-Headers", "Authorization");
    }
    next();
};

module.exports = credentials;