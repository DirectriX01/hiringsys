module.exports = (req, res, next) => {
    if (req.session.user.userType != 'employer') {
        return res.redirect('/');
    }
    next();
}