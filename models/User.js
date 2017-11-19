/*
 * Copyright (C) 2016-Present The MoonLake (mcmoonlake@hotmail.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var mysql = require('../util/mysql');
var utils = require('../util/utils');

/**
 * User Model
 *
 * @param {User} [user]
 * @constructor
 */
var User = function (user) {
    this.uuid = user.uuid;
    this.username = user.username;
    this.password = user.password;
    this.timestamp = user.timestamp;
    this.email = user.email;
    this.banned = false;
};

/**
 * Find User by Name
 *
 * @param {string} username
 * @return {Promise} User
 */
User.findUserByName = function (username) {
    return find('username', username)
};

/**
 * Find User by UUID
 *
 * @param {string} uuid
 * @return {Promise} User
 */
User.findUserByUUID = function (uuid) {
    return find('uuid', uuid)
};

/**
 * Save User
 *
 * @return {Promise}
 */
User.prototype.saveUser = function () {
    return mysql.query('insert into `user`(`uuid`,`username`,`password`,`timestamp`,`email`,`banned`) values(?,?,?,?,?,?);', [
        this.uuid,
        this.username,
        this.password,
        this.timestamp,
        this.email,
        this.banned
    ])
};

function find(field, value) {
    if(!field)
        field = 'username';
    if(!value) {
        return utils.ofPromise();
    } else {
        return utils.ofPromise(function (resolve, reject) {
            mysql.query('select * from `user` where binary `' + field + '`=? limit 1;', [value])
                .then(function (data) {
                    resolve(data.values === 0 ? null : data.values[0]);
                })
                .catch(function (err) {
                    reject(err);
                })
        })
    }
};

/**
 * Initialize User Model Table
 *
 * @returns {Promise}
 */
User.initializeTable = function () {
    return mysql.query(
        'create table `user`(' +
        '`uuid` varchar(32) not null unique,' +
        '`username` varchar(16) not null,' +
        '`password` varchar(255) not null,' +
        '`timestamp` bigint not null,' +
        '`email` varchar(255),' +
        '`banned` bool default 0 not null,' +
        'primary key(`uuid`));')
};

module.exports = User;
