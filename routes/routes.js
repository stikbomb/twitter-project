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

    app.get('/:page', (req, res) => {
        let limit = 10;   // number of records per page
        let offset = 0;
        models.item.findAndCountAll()
            .then((data) => {
                let page = req.params.page;      // page number
                let pages = Math.ceil(data.count / limit);
                offset = limit * (page - 1);
                models.item.findAll({
                    attributes: ['id', 'text', 'userName', 'createdAt'],
                    limit: limit,
                    offset: offset,
                    $sort: { id: 1 }
                })
                    .then((items) => {
                        // res.status(200).json({'result': items, 'count': data.count, 'pages': pages});
                        console.log(items + "   " + data.count + "     " + pages);
                        if (req.isAuthenticated()) {
                            res.render('./pages/pagination_user', {items: items, current: page, pages: pages});
                        } else {
                            res.render('./pages/pagination_guest', {items: items, current: page, pages: pages});
                        }
                    });
            })
            .catch(function (error) {
                res.status(500).send('Internal Server Error');
            });
    });
};