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

var security = require('./security');
var config = require('../config');
var mysql = require('./mysql');
var utils = require('./utils');

var comparePassword = function (raw, password) {
    // Interception of the password and salt to compare the hash value of the user's plain text password. If not, then invalid password
    // 截取密码和 salt 以比较用户纯文本密码的哈希值.  如果不符合, 则密码无效
    var salt = password.substr(0, password.indexOf('$'));
    var passwordHash = password.substr(password.indexOf('$') + 1);
    return security.sha256(security.sha256(raw) + salt) === passwordHash;
};

var findUserByName = function (username) {
    return findUser('username', username);
};

var findUserByUUID = function (uuid) {
    return findUser('uuid', uuid);
};

function findUser(field, value) {
    return find('user', field, value, 1);
};

var findTokenByClient = function (clientToken) {
    return findToken('clientToken', clientToken, 1);
};

var saveUserToken = function (token) {
    // TODO
    return token;
};

function findToken(field, value, limit) {
    return find('user-token', field, value, limit);
}

function find(table, field, value, limit) {
    if(!field)
        field = 'username';
    if(!value)
        return utils.ofPromise();
    return utils.ofPromise(function (resolve, reject) {
        mysql.query('select * from `' + table + '` where binary `' + field + '`=?' + (limit ? ' limit ' + limit + ';' : ';'), [value], function (err, values) {
            if(err) {
                reject(err);
            } else {
                resolve(limit && limit === 1 ? values[0] : values);
            }
        })
    })
}

module.exports = {
    comparePassword: comparePassword,
    findUserByName: findUserByName,
    findUserByUUID: findUserByUUID,
    findTokenByClient: findTokenByClient,
    saveUserToken: saveUserToken,
};
