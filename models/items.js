module.exports = function(sequelize, Sequelize) {

    var Item = sequelize.define('item', {

        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        text: {
            type: Sequelize.TEXT
        },

        userId: {
            type: Sequelize.INTEGER,
        },

        userName: {
            type: Sequelize.TEXT,
        }

    });

    return Item;

};