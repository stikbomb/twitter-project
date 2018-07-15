var authController = require('../controllers/authcontroller.js');
var models = require('../models');
module.exports = function(app, passport) {


    app.get('/signup', authController.signup);

    app.get('/signin', authController.signin);

    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/',
            failureRedirect: '/signup'
        }));

    app.get('/', authController.index);

    app.get('/logout', authController.logout);

    app.post('/signin', passport.authenticate('local-signin', {
            successRedirect: '/',

            failureRedirect: '/signin'
        }

    ));

    app.get('/user/:id', authController.user);

    app.post('/addItem', isLoggedIn, authController.addItem);

    function isLoggedIn(req, res, next) {

        if (req.isAuthenticated())

            return next();

        res.redirect('/signin');

    }

    app.get('/edit/:item', authController.editItem);

    app.post('/edit/:item', authController.editItema);

    app.get('/profile', authController.profile);
    app.post('/profile', authController.profileUpdate);

    app.get('/:page', authController.pagination);

    app.get('/retweet/:item', authController.retweetItem);

    app.get('/message/:id', authController.messagePage);

    app.post('/message/:id', authController.addAnswer);

};