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
var UserToken = require('../../models/UserToken');
var UserSession = require('../../models/UserSession');

/**
 * POST request when the client connects to the server.
 *
 * @param {string} accessToken
 * @param {string} selectedProfile
 * @param {string} serverId
 * @return If successful, return to http 204 state.
 * @see POST /sessionserver/session/minecraft/join
 */
var join = function (req, res) {

    var accessToken = req.body.accessToken;
    var selectedProfile = req.body.selectedProfile;
    var serverId = req.body.serverId;
    var ip = req.ip;

    Logger.info('User try  join server \'' + serverId + '\' with accessToken: ' + accessToken);

    if(!Util.isUUID(accessToken, true))
        throw new AuthError('ForbiddenOperationException', 'Invalid access token or Non-unsigned UUID format.', 403);
    if(!Util.isUUID(selectedProfile, true))
        throw new AuthError('ForbiddenOperationException', 'Invalid selected profile or Non-unsigned UUID format.', 403);

    UserToken.findTokenByAccess(accessToken)
        .then(function (token) {
            if(!token || token.userId !== selectedProfile) {
                throw new AuthError('ForbiddenOperationException', 'Invalid token or profile.', 403);
            } else {
                var session = UserSession.createSession(serverId, token.accessToken, token.userId, ip);
                if(!session.saveSession()) {
                    throw new AuthError('Internal Error', 'Failed to save session.', 500);
                } else {
                    Logger.info('User join server \'' + serverId + '\' with session: ' + JSON.stringify(session));
                    res.status(204);
                    res.json({});
                    res.end();
                }
            }
        })
        .catch(function (err) {
            AuthError.response(res, err);
        })
};

module.exports = join;
