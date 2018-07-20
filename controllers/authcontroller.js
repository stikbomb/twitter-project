
var models = require('../models');
var exports = module.exports = {};

models.item.hasMany(models.user, {foreignKey: 'id', sourceKey: 'userId'});
// models.item.hasMany(models.user, {foreignKey: 'id', sourceKey: 'orUserId'});


// models.item.belongsToMany(models.user, { as: 'usId', through: 'UserProject'});
// models.user.belongsToMany(models.item, { as: 'itId', through: 'UserProject'});

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


// exports.index = (req, res) => {
//     return models.sequelize.Promise.all([
//         models.item.findAll({
//             limit : 10,
//             include: [{
//                 model: models.user,
//                 where: {
//                     id: models.Sequelize.col('item.userId')},
//                 attributes: ['username']}]}),
//         models.item.findAll({
//             limit : 10,
//             include: [{
//                 model: models.user,
//                 where: {
//                     id: models.Sequelize.col('item.orUserId')},
//                 attributes: ['username']}]})
//     ])
//         .spread((items, items_r) => {
//             console.log("THIS! " + items);
//             console.log(JSON.stringify(items));
//             console.log("THERE! " + items_r);
//             console.log(JSON.stringify(items_r));
//             return res.render('./pages/index_guest', {
//                 items : items,
//                 items_r : items_r
//             });
//         })
// };



exports.index = function (req, res) {
    // models.user.belongsTo(models.item, {foreignKey: 'id', targetKey: 'userId'});
    //

    if (req.isAuthenticated()) {
        // var sessionId = req.user.id;
        // var userId = req.params.id;
        models.item.findAll({
            limit : 10,
            include: [{
                model: models.user,
                where: {
                    id: models.Sequelize.col('item.userId')},
                attributes: ['username']}]}).then(items => {
            res.render('./pages/index_user', {items : items, userId : req.user.id});
        });
    } else {
        models.item.findAll({
            limit : 10,

            include: [{
                model: models.user,
                where: {
                    id: models.Sequelize.col('item.userId')},
                attributes: ['username']}]}).then(items => {
        var newIndex = JSON.stringify(items);
        console.log(items);
        console.log(newIndex);
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

            text: req.body.itemText
        };

    console.log(req.user.username);
    console.log(req.session.passport.name);
    models.item.create(data).then(item => {
        console.log(item.get('text'));

    });
    res.redirect('/');
};

exports.user = function (req, res) {

    models.item.findAll(
        {limit : 10,
        include: [
            {model: models.user,
            where: {id: models.Sequelize.col('item.userId')},
            attributes: ['username']}],
        where: {userId: req.params.id}
        }).then(items => {
        if (req.isAuthenticated()) {
            if(req.params.id == req.user.id) {
                res.render('./pages/user_user_self', {items: items, userId: req.user.id});
                console.log('YEAH')
            } else {
                res.render('./pages/user_user', {items: items, userId: req.user.id});
                console.log('YEAH')
            }
        }
         else {
            res.render('./pages/user_guest', {items : items});
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
            console.log(items);
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
        parentId: item.id,
        text: item.text,
        retweet: 1
    })}).then(items => {
        res.redirect('/')
    })
};

exports.messagePage = (req, res) => {
    return models.sequelize.Promise.all([
        models.item.findAll({
            where: {parentId: req.params.id},
            include: [
                {
                    model: models.user,
                    where: {id: models.Sequelize.col('item.userId')},
                    attributes: ['username']
                }]
        }),
        models.item.findOne({
            where: {id: req.params.id},
            include: [
                {
                    model: models.user,
                    where: {id: models.Sequelize.col('item.userId')},
                    attributes: ['username']
                }],


        })
    ])


        .spread((items, item) => {
            console.log("THIS" + items);
            console.log(item);
            if (req.isAuthenticated()) {
                return res.render('./pages/message_user', {
                    items: items,
                    item: item,
                    userId: req.user.id
                });
            } else {
                return res.render('./pages/message_guest', {
                    items: items,
                    item: item
                })
            }
        })
};

exports.addAnswer = function(req, res) {
    models.item.findOne({where: {id: req.params.id}}).then(item => {
        console.log('Test');
        console.log(item);
        var data =

            {
                parentId: req.params.id,

                text: req.body.answerText,

                userId: req.user.id

                };
        models.item.create(data).then(newitem => {
            console.log(newitem);
            res.redirect('/');
        })
    });

};




exports.profile = function (req, res) {
    models.user.findOne({where: {id: req.user.id}}).then(user => {
        res.render("./pages/profile_user", {user : user});
    })
};

exports.profileUpdate = function (req, res) {
    console.log(req.body.answerText);
    models.user.update(

        {username : req.body.answerText},
        {where : {id : req.user.id}}).then(function() {

        console.log("Username was updated successfully!");
        res.redirect('/');
    }).catch(function(e) {
        console.log("Username update failed !");
    })
};

exports.pagination = function (req, res) {
    let limit = 10;   // number of records per page
    let offset = 0;
    models.item.hasMany(models.user, {foreignKey: 'id', sourceKey: 'userId'});
    models.item.findAndCountAll()
        .then((data) => {
            let page = req.params.page;      // page number
            let pages = Math.ceil(data.count / limit);
            offset = limit * (page - 1);
            models.item.findAll({
                subQuery: false,
                attributes: ['id', 'text', 'createdAt', 'userId'],
                limit: limit,
                offset: offset,
                $sort: { id: 1 },
                include: [{model: models.user, where: {id: models.Sequelize.col('item.userId')}, attributes: ['username']}]
            })
                .then((items) => {
                    // res.status(200).json({'result': items, 'count': data.count, 'pages': pages});
                    console.log(items + "   " + data.count + "     " + pages);
                    if (req.isAuthenticated()) {
                        res.render('./pages/pagination_user', {items: items, current: page, pages: pages, userId: req.user.id});
                    } else {
                        res.render('./pages/pagination_guest', {items: items, current: page, pages: pages});
                    }
                });
        })
        .catch(function (error) {
            res.status(500).send('Internal Server Error');
        });
};

