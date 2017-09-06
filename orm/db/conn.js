'use strict';

let Sequelize = require('sequelize');

let sequelize = new Sequelize('study_node', 'root', '', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

module.exports = sequelize;