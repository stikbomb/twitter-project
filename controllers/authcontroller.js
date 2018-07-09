
var Item = require('../models/items');
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




// exports.index = function (req, res) {
//     var items = models.item.findAll();
//     // models.item.findAll().then(items => {
//     // console.log(items);
//     // result = items;});
//
//     if (req.isAuthenticated()) {
//         var test = 12;
//         res.render('./pages/index_user', {items}, {test : test});
//     } else {
//         res.render('./pages/index_guest', {items});
//     }
//
//
//
// };

exports.index = function (req, res) {
    if (req.isAuthenticated()) {
        // var sessionId = req.user.id;
        // var userId = req.params.id;
        models.item.findAll({limit : 10}).then(items => {
            res.render('./pages/index_user', {items : items, userId : req.user.id});
        });
    } else {
        models.item.findAll({limit :10}).then(items => {
            res.render('./pages/index_guest', {items});
        });
    }
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

            userName: req.user.username,
        };

    console.log(req.user.username);
    console.log(req.session.passport.name);
    models.item.create(data).then(item => {
        console.log(item.get('text'));

    });
    res.redirect('/');
};

exports.user = function (req, res) {
    models.item.findAll({ where: {userId: req.params.id}}).then(items => {
        if (req.params.id == req.user.id) {
            res.render('./pages/user_user', {items : items, userId : req.user.id});
            console.log('YEAH')
        }
        else {
            res.render('./pages/user_guest', {items : items, userId : req.user.id});
            console.log('Nonono');
        }
    })

};

// exports.editItem = function(req, res) {
//     var indexItem = req.params.item;
//     console.log('Thie' + indexItem);
//     // if (req.params.id == req.user.id) {
//
//     console.log("thie 0");
//     models.item.findAll().then(items => {
//         console.log("this 1");}).then(oldContent => {
//             models.item.findOne({where: {id: indexItem}}
//                 console.log("this 2");
//                 res.render('./pages/user_edit', {items : items, oldContent: "123"});
//
//         // });
//         // } else {
//         // res.redirect('/');
//     })
// }

exports.editItem = (req, res, next) => {
    var indexItem = req.params.item;
    return models.sequelize.Promise.all([
        models.item.findAll({}),
        models.item.findOne({
           where: {id: indexItem}
        })
    ])
        .spread((items, item) => {
            console.log(item);
            return res.render('./pages/user_edit', {
                items : items,
                oldContent : item,
                userId : req.user.id
            });
        })
        .catch(next);
};

// exports.editItema = (req, res) => {
//     var index = req.params.item;
//     models.item.update(
//         {text : req.body.itemText},
//         {id : index}).then(function() {
//
//         console.log("Project with id =1 updated successfully!");
//         res.redirect('/');
//     }).catch(function(e) {
//         console.log("Project update failed !");
//     })
// };

exports.editItema = (req, res) => {
    var index = req.params.item;
    models.item.update(
        {text : req.body.itemText},
        {where : {id : index}}).then(function() {

        console.log("Project with id =1 updated successfully!");
        res.redirect('/');
    }).catch(function(e) {
        console.log("Project update failed !");
    })
};

exports.retweetItem = (req, res) => {
    var index = req.params.item;
    models.item.findOne({where : {id : index}}).then(item => {
    models.item.create({
        userId: req.user.id,
        orUserName: item.userName,
        orCreatedAt: item.createdAt,
        text: item.text,
        userName: req.user.username,
        retweet: 1
    })}).then(items => {
        res.redirect('/')
    })
};

exports.validateUser = (req, res, next) => {
    var index = req.params.item;
    models.item.findOne({ where: {id : index}}).then(item => {
            if (item.userId === req.user.id) {
                return next();
            } else {
                res.redirect('/');
            }
        }
    )
};
