module.exports = {
    isAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.level == true){
            return next();
        }
        req.flash("errorMessage", "Ops. Apenas administradores.");
        res.redirect("/");
    }
}