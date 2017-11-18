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
var uuid = require('../../util/uuid');
var utils = require('../../util/utils');
var users = require('../../util/users');

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
    var requestUser = req.body.requestUser || false; // TODO request User
    var agent = req.body.agent;

    if(agent === undefined || (agent.name !== 'Minecraft' || agent.version !== 1))
        throw new authError('ForbiddenOperationException', 'Invalid agent.', 403);

    request(username, password, clientToken)
        .then(function (result) {
            res.json(result);
            res.end();
        })
        .catch(function (err) {
            authErrorRes(res, err);
        });
};

function request(username, password, clientToken) {
    if(clientToken && !uuid.is(clientToken, true)) {
        return utils.ofPromise(function (resolve, reject) {
            reject(new authError('ForbiddenOperationException', 'Invalid client token. Non-unsigned UUID format.', 403));
        })
    }
    return users.findUserByName(username)
        .then(function (user) {
            if(user && password && users.comparePassword(password, user.password)) {
                var token = {
                    userId: user.uuid,
                    username: user.username,
                    accessToken: uuid.random(true),
                    clientToken: clientToken || uuid.random(true),
                    timestamp: utils.timestamp()
                };
                if(clientToken) {
                    return users.findTokenByClient(clientToken)
                        .then(function (userToken) {
                            if(userToken)
                                token.accessToken = userToken.accessToken;
                            return users.saveUserToken(token);
                        })
                } else {
                    return users.saveUserToken(token);
                }
            } else {
                throw new authError('ForbiddenOperationException', 'Invalid username or password.', 403);
            }
        })
        .then(function (token) {
            var profile = {
                id: token.userId,
                username: token.username
            };
            return {
                accessToken: token.accessToken,
                clientToken: token.clientToken,
                selectedProfile: profile,
                availableProfiles: [
                    profile
                ]
            }
        })
}

module.exports  = authenticate;
