import Sequelize from "sequelize";
import sequelize from "../db/conn";

const DEFAULT_OPTS = {
    freezeTableName: true,
    timestamps: false
};

export const Project = sequelize.define('project', {
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
}, DEFAULT_OPTS);

export const User = sequelize.define('user', {
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
}, DEFAULT_OPTS);

User.belongsTo(Project, {as: 'project', foreignKey: 'project_id', targetKey: 'id'});
Project.hasMany(User, {as: 'users', foreignKey: 'project_id'});

export function truncate(callback) {
    sequelize
        .transaction({type: Sequelize.Transaction.EXCLUSIVE}, trans => {
            return Promise.all([
                sequelize.query('SET FOREIGN_KEY_CHECKS = 0', {transaction: trans}),
                sequelize.query("TRUNCATE TABLE project", {transaction: trans}),
                sequelize.query("TRUNCATE TABLE user", {transaction: trans}),
                sequelize.query('SET FOREIGN_KEY_CHECKS = 1', {transaction: trans})
            ]);
        })
        .then(callback)
        .catch(err => {
            throw err
        });
}