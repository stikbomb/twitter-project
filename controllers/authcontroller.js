var models = require('../models');
var exports = module.exports = {};
exports.signup = function(req, res) {

    res.render('./pages/signup');
};

exports.signin = function(req, res) {

    res.render('./pages/signin');
};

// var items = function() {
//     return models.item.findAll();
// };



exports.index = function (req, res) {
    models.item.findAll().then(items => {

    console.log(items);
    if (req.isAuthenticated()) {
        res.render('./pages/index_user', {items});
    } else {
        console.log(items);
        res.render('./pages/index_guest', {items});
    }


    })
};

exports.logout = function(req, res) {

    req.session.destroy(function(err) {

        res.redirect('/');

    });
};

exports.addItem = function(req, res) {
    var data =

        {
            userId: req.user.id,

            text: req.body.itemText,
        };

    models.item.create(data).then(item => {
        console.log(item.get('text'));

    });
    res.redirect('/');
};