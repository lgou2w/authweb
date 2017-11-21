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

var AuthError = require('../../util/AuthError');
var Logger = require('../../util/Logger');
var Util = require('../../util/Util');
var User = require('../../models/User');
var UserToken = require('../../models/UserToken');

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
var authenticate = function (req, res) {

    // TODO Request Limit

    var username = req.body.username;
    var password = req.body.password;
    var clientToken = req.body.clientToken;
    var requestUser = req.body.requestUser || false;
    var agent = req.body.agent;

    if(!username || !password)
        throw new AuthError('ForbiddenOperationException', 'Invalid credentials. Invalid username or password.', 403);
    if(!agent || (agent.name !== 'Minecraft' || agent.version !== 1))
        throw new AuthError('ForbiddenOperationException', 'Invalid agent.', 403);
    if(clientToken && !Util.isUUID(clientToken, true))
        throw new AuthError('ForbiddenOperationException', 'Invalid client token. Non-unsigned UUID format.', 403);

    Logger.info('User authenticate with username: ' + username);

    User.findUserByName(username)
        .then(function (user) {
            if(!user || !user.verifyPassword(password)) {
                throw new AuthError('ForbiddenOperationException', 'Invalid credentials. Invalid username or password.', 403);
            } else {
                if(user.banned)
                    throw new AuthError('ForbiddenOperationException', 'Account has been banned.', 403);
                var result = { userId: user.uuid, username: user.username };
                UserToken.findTokenByClientOrCreate(user.uuid, clientToken)
                    .then(function (token) {
                        result.accessToken = token.accessToken;
                        result.clientToken = token.clientToken;
                        return result;
                    })
                    .then(function (result) {
                        var profile = {
                            id: result.userId,
                            username: result.username
                        };
                        res.json({
                            accessToken: result.accessToken,
                            clientToken: result.clientToken,
                            selectedProfile: profile,
                            availableProfiles: [profile]
                        });
                        res.end();
                    });
            }
        })
        .catch(function (err) {
            AuthError.response(res, err);
        })
};

module.exports  = authenticate;
