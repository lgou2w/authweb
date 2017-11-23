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

var config = require('../config.json');
var Security = require('../util/Security');
var MySQL = require('../util/MySQL');
var Util = require('../util/Util');

/**
 * User Model
 *
 * @constructor
 * @param {User | {uuid: string, username: string, password: string, timestamp: number, email: string, banned: number | boolean}} [user]
 */
function User(user) {
    this.uuid = user.uuid;
    this.username = user.username;
    this.password = user.password;
    this.timestamp = user.timestamp;
    this.email = user.email;
    this.banned = typeof user.banned === 'number' ? user.banned === 1 : user.banned;
}

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
 * Security User Password
 *
 * @param {string} raw
 * @return {string}
 */
User.securityPassword = function (raw) {
    var passwordType = config.user.password;
    switch(passwordType) {
        case 'Raw':
            return raw;
        case 'MD5':
            return Security.md5(raw);
        case 'SHA256':
            return Security.sha256(raw);
        case 'SHA512':
            return Security.sha512(raw);
        case 'MD5WithSalt':
            var salt = Util.generateStringHex(16);
            return salt + '$' + Security.md5(Security.md5(raw) + salt);
        case 'SHA256WithSalt':
            var salt = Util.generateStringHex(16);
            return salt + '$' + Security.sha256(Security.sha256(raw) + salt);
        case 'SHA512WithSalt':
            var salt = Util.generateStringHex(16);
            return salt + '$' + Security.sha512(Security.sha512(raw) + salt);
        default:
            throw new Error('Invalid password hash type: ' + passwordType);
    }
};

/**
 * Verify User Password
 *
 * @param {string} raw
 * @return {boolean}
 */
User.prototype.verifyPassword = function (raw) {
    var passwordType = config.user.password;
    var password = this.password;
    switch(passwordType) {
        case 'Raw':
            return raw === password;
        case 'MD5':
            return Security.md5(raw) === password;
        case 'SHA256':
            return Security.sha256(raw) === password;
        case 'SHA512':
            return Security.sha512(raw) === password;
        case 'MD5WithSalt':
            var line = password.split('\$');
            return line.length === 2 && Security.md5(Security.md5(raw) + line[0]) === line[1];
        case 'SHA256WithSalt':
            var line = password.split('\$');
            return line.length === 2 && Security.sha256(Security.sha256(raw) + line[0]) === line[1];
        case 'SHA512WithSalt':
            var line = password.split('\$');
            return line.length === 2 && Security.sha512(Security.sha512(raw) + line[0]) === line[1];
        default:
            throw new Error('Invalid password hash type: ' + passwordType);
    }
};

/**
 * Save User
 *
 * @return {Promise}
 */
User.prototype.saveUser = function () {
    var user = this;
    return MySQL.query('insert into `user`(`uuid`,`username`,`password`,`timestamp`,`email`,`banned`) values(?,?,?,?,?,?);', [
        user.uuid,
        user.username,
        user.password,
        user.timestamp,
        user.email,
        user.banned || 0
    ])
        .then(function () {
            return user;
        })
};

function find(field, value) {
    if(!field)
        field = 'username';
    if(!value) {
        return Util.ofPromise();
    } else {
        return MySQL.query('select * from `user` where binary `' + field + '`=? limit 1;', [value])
            .then(function (data) {
                return data.values.length === 0 ? null : new User(data.values[0]);
            })
    }
};

/**
 * Initialize User Model Table
 *
 * @returns {Promise}
 */
User.initializeTable = function () {
    return MySQL.query(
        'create table `user`(' +
        '`uuid` varchar(32) not null unique,' +
        '`username` varchar(16) not null,' +
        '`password` varchar(255) not null,' +
        '`timestamp` bigint not null,' +
        '`email` varchar(255),' +
        '`banned` bool default \'0\' not null,' +
        'primary key(`uuid`));')
};

module.exports = User;
