// This is a middleware function that we don't want to use on every single route, hence why is not done with app.use!

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    };
}