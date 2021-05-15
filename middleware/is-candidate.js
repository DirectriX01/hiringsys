module.exports = (req, res, next) => {
    if (req.session.user.userType != 'candidate') {
        return res.redirect('/');
    }
    next();
}  