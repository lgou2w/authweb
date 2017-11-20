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
var AuthError = require('../util/AuthError');
var Logger = require('../util/Logger');
var MySQL = require('../util/MySQL');
var Util = require('../util/Util');

/**
 * User Token Model
 *
 * @param {UserToken} [userToken]
 * @constructor
 */
function UserToken(userToken) {
    this.accessToken = userToken.accessToken;
    this.clientToken = userToken.clientToken;
    this.userId = userToken.userId;
    this.timestamp = userToken.timestamp;
    this.valid = userToken.valid || Util.timestamp() - this.timestamp < config.user.token.validity;
};

/**
 * Create User Token
 *
 * @param {string} userId
 * @param {string} [clientToken]
 * @returns {UserToken}
 */
UserToken.createToken = function (userId, clientToken) {
   return new UserToken({
       accessToken: Util.randomUUID(true),
       clientToken: clientToken || Util.randomUUID(true),
       userId: userId,
       timestamp: Util.timestamp()
   })
};

/**
 * Find User Token by Client Token
 *
 * @param {string} clientToken
 * @return {Promise}
 */
UserToken.findTokenByClient = function (clientToken) {
    return Util.ofPromise(function (resolve, reject) {
        find('clientToken', clientToken, 1)
            .then(function (tokens) {
                resolve(tokens ? tokens[0] : null);
            });
    })
};

/**
 * Find User Token by User UUID
 *
 * @param {string} userId
 * @return {Promise}
 */
UserToken.findTokensByUserId = function (userId) {
    return find('userId', userId);
};

/**
 * Find User Token by Client Token or Create new Token
 *
 * @param {string} userId
 * @param {string} [clientToken]
 */
UserToken.findTokenByClientOrCreate = function (userId, clientToken) {
    if(!clientToken) {
        return UserToken.findTokensByUserId(userId)
            .then(function (tokens) {
                if(tokens && tokens.length >= config.user.token.max) {
                    throw new AuthError('ForbiddenOperationException', 'Invalid clientToken. The maximum number of accessToken.', 403)
                } else {
                    return UserToken.createToken(userId).saveToken();
                }
            })
    } else {
        return UserToken.findTokenByClient(clientToken)
            .then(function (token) {
                if(!token) {
                    return UserToken.createToken(userId, clientToken).saveToken();
                } else {
                    return token;
                }
            })
    }
};

/**
 * Find User Token by Access Token
 *
 * @param {string} accessToken
 * @return {Promise}
 */
UserToken.findTokenByAccess = function (accessToken) {
    return Util.ofPromise(function (resolve, reject) {
        find('accessToken', accessToken, 1)
            .then(function (tokens) {
                resolve(tokens ? tokens[0] : null);
            });
    })
};

/**
 * Delete User Token by Access Token
 *
 * @param {string} accessToken
 */
UserToken.deleteTokenByAccess = function (accessToken) {
    return MySQL.query('delete from `user-token` where binary `accessToken`=?;', [accessToken])
        .then(function () {
            Logger.info('User a token is deleted from accessToken: ' + accessToken)
        });
};

/**
 * Save User Token
 *
 * @returns {Promise}
 */
UserToken.prototype.saveToken = function () {
    var token = this;
    return MySQL.query('insert into `user-token`(`accessToken`,`clientToken`,`userId`,`timestamp`) values(?,?,?,?);', [
        token.accessToken,
        token.clientToken,
        token.userId,
        token.timestamp
    ])
        .then(function () {
            Logger.info('User an new token generated and stored: ' + JSON.stringify(token));
            return token;
        })
};

/**
 * Validate User Token
 *
 * @param {string} accessToken
 * @param {string} [clientToken]
 */
UserToken.prototype.validate = function (accessToken, clientToken) {
    if(!accessToken || (clientToken && this.clientToken !== clientToken))
        return false;
    return this.accessToken === accessToken && this.valid;
};

function find(field, value, limit) {
    if(!limit)
        limit = config.user.token.max;
    if(!field)
        field = 'userId';
    if(!value) {
        return Util.ofPromise();
    } else {
        return Util.ofPromise(function (resolve, reject) {
            MySQL.query('select * from `user-token` where binary `' + field + '`=? limit ' + limit + ';', [value])
                .then(function (data) {
                    if(data.values.length === 0) {
                        resolve(null);
                    } else {
                        var tokens = [];
                        for(var index in data.values) {
                            var token = new UserToken(data.values[index]);
                            tokens.push(token);
                        }
                        resolve(tokens);
                    }
                })
                .catch(function (err) {
                    reject(err);
                })
        })
    }
};

/**
 * Initialize User Token Model Table
 *
 * @returns {Promise}
 */
UserToken.initializeTable = function () {
    return MySQL.query(
        'create table `user-token`(' +
        '`accessToken` varchar(32) not null unique,' +
        '`clientToken` varchar(32) not null,' +
        '`userId` varchar(32) not null,' +
        '`timestamp` bigint not null,' +
        'primary key(`accessToken`));')
};

module.exports = UserToken;
