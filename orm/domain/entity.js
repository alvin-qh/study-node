'use strict';

let Sequelize = require('sequelize');
let sequelize = require('../db/conn');

let _defaultOpts = {
    freezeTableName: true,
    timestamps: false
};

let _Project = sequelize.define('project', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    type: {
        type: Sequelize.STRING,
        field: 'type'
    }
}, _defaultOpts);

let _User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    gender: {
        type: Sequelize.STRING,
        field: 'gender'
    },
    birthday: {
        type: Sequelize.DATE,
        field: 'birthday',
        allowNull: true
    },
    phone: {
        type: Sequelize.STRING,
        field: 'phone'
    },
    projectId: {
        type: Sequelize.INTEGER,
        field: 'project_id'
    }
}, _defaultOpts);

let _XXX = _User.belongsTo(_Project, {as: 'project', foreignKey: 'project_id', targetKey: 'id'});

_Project.hasMany(_User, {as: 'users', foreignKey: 'project_id'});

function _truncate(callback) {
    sequelize.transaction({type: Sequelize.Transaction.EXCLUSIVE}, (trans) => {
        return Promise.all([
            sequelize.query('SET FOREIGN_KEY_CHECKS = 0', {transaction: trans}),
            sequelize.query("TRUNCATE TABLE project", {transaction: trans}),
            sequelize.query("TRUNCATE TABLE user", {transaction: trans}),
            sequelize.query('SET FOREIGN_KEY_CHECKS = 1', {transaction: trans})
        ]);
    }).then(callback).catch((err) => {
        throw err;
    });
}

module.exports = {
    Project: _Project,
    User: _User,
    XXX: _XXX,
    truncate: _truncate
};