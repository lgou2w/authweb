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

var authErrorRes = require('../../util/authError').authErrorRes;
var authError = require('../../util/authError').authError;
var security = require('../../util/security');
var uuid = require('../../util/uuid');

/**
 * POST request when the client uses a username and password for authentication.
 *
 * @param {string} username
 * @param {string} password
 * @param {string} [clientToken]
 * @param {boolean} requestUser
 * @param {json} agent
 * @param       {string} name
 * @param       {int} version
 * @see POST /authserver/authenticate
 */
var authenticate = function (req, res) { //TODO Violent request

    var username = req.body.username;
    var password = req.body.password;
    var clientToken = req.body.clientToken;
    var requestUser = req.body.requestUser || false;
    var agent = req.body.agent;

    // If the username or password are not defined, login is invalid
    // 如果用户名或密码都未定义, 登录无效
    if(username === undefined || password === undefined)
        throw new authError('ForbiddenOperationException', 'Invalid username or password.', 403);
    // If the agent is not defined or the name of the agent is not Minecraft or the version is not 1, login is invalid
    // 如果 agent 未定义或 agent 的名字不为 Minecraft 或版本不为 1, 登录无效
    if(agent === undefined || (agent.name !== 'Minecraft' || agent.version !== 1))
        throw new authError('ForbiddenOperationException', 'Invalid agent.', 403);
    // Otherwise check the user's password for verification
    // 否则获取用户的密码进行验证
    var mysql = req.app.get('mysql');
    mysql.query('select `password`,`uuid` from `user` where binary `username`=? limit 1;', [username], function (err, values) {
        if(err) {
            authErrorRes(res, 'Internal Error', err.message, 500);
            return;
        }
        // Verify user information and query user profile
        // 验证用户信息并且查询用户档案
        validateAndQueryProfile(req, res, mysql, {
            username: username,
            password: password,
            clientToken: clientToken,
            requestUser: requestUser
        }, values, function (err, userProfile) {
            if(err) {
                authErrorRes(res, 'Internal Error', err.message, 500);
                return;
            }
            // return user profile
            // 返回用户档案
            res.json(userProfile);
            res.end();
        });
    });
};

function validateAndQueryProfile(req, res, mysql, user, values, callback) {
    // If the length is 0, then invalid username
    // 如果长度为 0, 则表示无效的用户名
    if(values.length === 0) {
        authErrorRes(res, 'ForbiddenOperationException', 'Invalid username.', 403);
        return;
    }
    // Interception of the password and salt to compare the hash value of the user's plain text password. If not, then invalid password
    // 截取密码和salt以比较用户纯文本密码的哈希值.  如果不符合, 则密码无效
    var password = values[0].password;
    var salt = password.substr(0, password.indexOf('$'));
    var passwordHash = password.substr(password.indexOf('$') + 1);
    if(security.sha256(security.sha256(user.password) + salt) !== passwordHash) {
        authErrorRes(res, 'ForbiddenOperationException', 'Invalid password.', 403);
        return;
    }
    user.uuid = values[0].uuid;
    var clientToken = user.clientToken;
    // Generated if the client does not provide a clientToken
    // 如果客户端未提供客户端令牌则生成
    if(clientToken === undefined) {
        // Detects the maximum number of access tokens. If the limit, then login failed
        // 检测最大访问令牌数量. 如果限制, 则登录失败
        var tokenMaxCount = req.app.get('config').token.maxCount;
        mysql.query('select `id` from `user-token` where binary `userId`=? limit ?;', [user.uuid, tokenMaxCount], function (err, values) {
            if(err) {
                callback(err);
                return;
            }
            // Login failed if limit token has been exceeded
            // 如果超过限制令牌, 则登录失败
            if(values.length >= tokenMaxCount) {
                authErrorRes(res, 'ForbiddenOperationException', 'Invalid clientToken. The maximum number of accessToken.', 403);
                return;
            }
            // Otherwise, a new token is generated and stored
            // 否则生成并存储新的令牌
            var accessToken = uuid.random(true);
            clientToken = uuid.random(true);
            mysql.query('insert into `user-token`(`accessToken`,`clientToken`,`userId`,`timestamp`) values(?,?,?,?);', [
                accessToken,
                clientToken,
                user.uuid,
                new Date().getTime()
            ], function (err) {
                if(err) {
                    callback(err);
                } else {
                    callback(null, buildUserProfile(accessToken, clientToken, user));
                }
            });
        });
    } else {
        // Query the accessTokens for the given clientToken and user id
        // 查询给定的客户端令牌和用户ID的访问令牌

        // Limit clientToken to unsigned UUID
        // 限制客户端令牌强制为无符号 UUID
        if(!uuid.is(clientToken, true)) {
            authErrorRes(res, 'ForbiddenOperationException', 'Invalid clientToken. Non-unsigned UUID format.', 403);
            return;
        }
        // Otherwise, the format of clientToken is correct, then query
        // 否则客户端令牌的格式正确, 则查询
        mysql.query('select `accessToken`,`timestamp` from `user-token` where binary `clientToken`=? and binary `userId`=? limit 1;', [
            clientToken,
            user.uuid
        ], function (err, values) {
            if(err) {
                callback(err);
            } else {
                // TODO validate accessToken
                if(values.length === 0) {
                }
                var accessToken = values[0].accessToken;
                var timestamp = values[0].timestamp;
                callback(null, values);
            }
        });
    }
}

function buildUserProfile(accessToken, clientToken, user) {
    var profile = {
        id: user.uuid,
        name: user.username
    };
    return {
        accessToken: accessToken,
        clientToken: clientToken,
        selectedProfile: profile,
        availableProfiles: [
            profile
        ]
    };
}

module.exports  = authenticate;
