const ExpressError = require('../utils/ExpressError');
const wrapAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            next(new ExpressError(err.status, err.message));
        });
    };
};


module.exports = wrapAsync;