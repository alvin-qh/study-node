import {expect} from "chai";

import sequelize from "../src/db/conn";

import {Project, truncate, User} from "../src/domain/entites"
import moment from "moment";

function seed(done) {
    sequelize.transaction({type: sequelize.Transaction.EXCLUSIVE}, trans => {
        trans = {transaction: trans};

        // Create entity
        return Project
            .create({
                    name: 'Roomis',
                    type: 'DEV'
                }, trans
            )
            .then(project => {
                const user1 = User.create({
                    name: 'Alvin',
                    gender: 'M',
                    birthday: moment.utc('1981-03-17'),
                    phone: '13991320110',
                    projectId: project.get('id')
                }, trans);

                const user2 = User.create({
                    name: 'Emma',
                    gender: 'F',
                    birthday: moment.utc('1985-03-29'),
                    phone: '13991320112',
                    projectId: project.get('id')
                }, trans);

                return Promise.all([user1, user2]);
            });
    }).then(() => done());
}

describe('Test entity', () => {

    before(done => {
        truncate(() => seed(done));
    });

    /**
     * SELECT `id`, `name`, `gender`, `birthday`, `phone` FROM `user` AS `user` WHERE `user`.`name` = 'Alvin';
     */
    it('Test "query"', done => {
        User
            .findAll({
                where: {
                    name: 'Alvin'
                }
            })
            .then(users => {
                expect(users.length).is.equal(1);
                expect(users[0].get('name')).is.equal('Alvin');
                done()
            });
    });

    /**
     * SELECT `name`, `gender` FROM `user` AS `user` WHERE `user`.`name` = 'Alvin';
     */
    it('Test "query with attribute"', done => {
        User
            .findAll({
                attributes: ['name', 'gender'],
                where: {
                    name: 'Alvin'
                }
            })
            .then(users => {
                expect(users.length).is.equal(1);
                expect(users[0].get('name')).is.equal('Alvin');
                expect(users[0].get('birthday')).to.be.undefined;
                done();
            });
    });

    /**
     * SELECT `name`, length(`name`) AS `length` FROM `user` AS `user` WHERE `user`.`name` = 'Alvin';
     */
    it('Test "query with fn function in attributes"', done => {
        User
            .findAll({
                attributes: ['name', [sequelize.fn('length', sequelize.col('name')), 'length']],
                where: {
                    name: 'Alvin'
                }
            })
            .then(users => {
                expect(users.length).is.equal(1);
                expect(users[0].get('name')).is.equal('Alvin');
                expect(users[0].get('length')).is.equal(5);
                done();
            });
    });

    /**
     * SELECT `id`, `name`, `gender`, `birthday`, `phone` FROM `user` AS `user`
     * WHERE `user`.`name` LIKE 'A%' AND (`user`.`gender` = 'M' OR `user`.`birthday` < '1989-12-31 16:00:00');
     */
    it('Test "query by operates in where condition"', done => {
        User
            .findAll({
                where: {
                    name: {
                        $like: 'A%'
                    },
                    $or: {
                        gender: 'M',
                        birthday: {
                            $lt: '1990-01-01'
                        }
                    }
                }
            })
            .then(users => {
                expect(users.length).is.equal(1);
                expect(users[0].get('name')).is.equal('Alvin');
                done();
            });
    });

    /**
     * SELECT `id`, `name`, `gender`, `birthday`, `phone` FROM `user` AS `user` LIMIT 0, 1;
     */
    it('Test "limit and pagination"', done => {
        User
            .findAll({
                offset: 0,
                limit: 1
            })
            .then(users => {
                expect(users.length).is.equal(1);
                expect(users[0].get('name')).is.equal('Alvin');
                done();
            });
    });

    /**
     * SELECT `id`, `name`, `gender`, `birthday`, `phone`
     * FROM `user` AS `user` ORDER BY `user`.`birthday` DESC;
     */
    it('Test "Query and order"', done => {
        User
            .findAll({
                order: [
                    ['birthday', 'DESC']
                ]
            })
            .then(users => {
                expect(users.length).is.equal(2);
                expect(users[0].get('name')).is.equal('Emma');
                expect(users[1].get('name')).is.equal('Alvin');
                done();
            });
    });

    /**
     * SELECT count(*) AS `count` FROM `user` AS `user` WHERE `user`.`gender` = 'M';
     */
    it('Test "count query"', done => {
        User.count({
            where: {
                gender: 'M'
            }
        }).then(count => {
            expect(count).is.equal(1);
            done();
        });
    });

    /**
     * SELECT COUNT(*) AS `count` FROM `user` AS `user`;
     *
     * SELECT MAX(`birthday`) AS `max_birthday` FROM `user` AS `user`;
     */
    it('Test "fn" function', done => {
        Promise.all([
            User.findAll({
                attributes: [[sequelize.fn('COUNT', sequelize.col('*')), 'count']]
            }).then((results) => {
                expect(results[0].get('count')).is.equal(2);
            }),

            User.findAll({
                attributes: [[sequelize.fn('MAX', sequelize.col('birthday')), 'max_birthday']]
            }).then((results) => {
                expect(moment.utc(results[0].get('max_birthday')).format()).is.equal('1985-03-29T00:00:00Z');
            })
        ]).then(() => {
            done();
        }).catch(err => {
            console.log(err);
            done()
        });
    });

    /**
     * SELECT `id`, `name`, `gender`, `birthday`, `phone`, `project_id` AS `projectId`, `project_id`
     * FROM `user` AS `user` WHERE `user`.`name` = 'Alvin';
     *
     * SELECT `id`, `name`, `type` FROM `project` AS `project` WHERE (`project`.`id` = 1);
     */
    it('Test "Relations" from one side', done => {
        User
            .findAll({
                where: {
                    name: 'Alvin'
                }
            })
            .then(users => {
                users[0].getProject()
                    .then(project => {
                        expect(project.get('name')).is.equal('Roomis');
                        done();
                    });
            });
    });

    /**
     * SELECT `user`.`id`, `user`.`name`, `user`.`gender`, `user`.`birthday`, `user`.`phone`,
     * `user`.`project_id` AS `projectId`, `user`.`project_id`,
     * `project`.`id` AS `project.id`, `project`.`name` AS `project.name`,
     * `project`.`type` AS `project.type`
     * FROM `user` AS `user` LEFT OUTER JOIN `project` AS `project`
     * ON `user`.`project_id` = `project`.`id` WHERE `user`.`name` = 'Alvin';
     */
    it('Test "Relations" from one side with join', done => {
        User
            .findAll({
                where: {
                    name: 'Alvin'
                },
                include: [
                    {model: Project, as: Project.tableName}
                ]
            })
            .then(users => {
                expect(users[0].get('project').get('name')).is.equal('Roomis');
                done();
            });
    });


    /**
     * UPDATE `user` SET `phone`='13999999999' WHERE `name` = 'Alvin';
     */
    it('Test "Update by condition"', done => {
        User
            .update({
                phone: '13999999999'
            }, {
                where: {
                    name: 'Alvin'
                }
            })
            .then((count) => {    // count is an integer array, include rows effected
                expect(count[0]).is.equal(1);

                User
                    .findAll({
                        where: {
                            name: 'Alvin'
                        }
                    })
                    .then(users => {
                        expect(users[0].get('phone')).is.equal('13999999999');
                        done();
                    });
            });
    });

    /**
     * UPDATE `user` SET `phone`='13999999999' WHERE `name` = 'Alvin';
     */
    it('Test "Update by model"', done => {
        User
            .findAll({
                where: {
                    name: 'Alvin'
                }
            })
            .then(users => {
                users[0].set('phone', '13991302111');
                users[0].save()
                    .then(res => {
                        expect(res.get('phone')).is.equal('13991302111');
                        done();
                    });
            });
    });

    /**
     * DELETE FROM `user` WHERE `id` = 1 LIMIT 1
     */
    it('Test "Delete by model"', done => {
        User
            .findAll({
                where: {
                    name: 'Alvin'
                }
            })
            .then((users) => {
                users[0].destroy()
                    .then(res => {
                        expect(res.get('name')).is.equal('Alvin');
                        done();
                    });
            });
    });
});