module.exports = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return (req.url == '/')? res.redirect('/login') : res.redirect('/login?next=' + req.url);
    }
    next();
};