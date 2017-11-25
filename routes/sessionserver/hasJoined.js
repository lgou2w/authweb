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
var UserToken = require('../../models/UserToken');
var UserSession = require('../../models/UserSession');
var UserProfile = require('../../models/UserProfile');
var UserProperty = require('../../models/UserProperty');
var Texture = require('../../models/Texture');
var config = require('../../config');

/**
 * GET request when the server authenticates the client.
 *
 * @param {string} serverId
 * @param {string} username
 * @param {string} [ip]
 * @return If failed, return to http state 204.
 * @see GET /sessionserver/session/minecraft/hasJoined
 */
var hasJoined = function (req, res) {
    var serverId = req.query.serverId;
    var username = req.query.username;
    var ip = req.query.ip;

    Logger.info('Try get has join server \'' + serverId + '\' with accessToken: ' + username);

    if(!serverId)
        throw new AuthError('ForbiddenOperationException', 'Invalid server id.', 204);
    if(!username)
        throw new AuthError('ForbiddenOperationException', 'Invalid username.', 204);

    var session = UserSession.findSessionByServerId(serverId);
    if(!session || (ip && session.ip !== ip))
        throw new AuthError('ForbiddenOperationException', 'Invalid session or ip.', 204);

    UserToken.findTokenByAccess(session.accessToken)
        .then(function (token) {
            if(!token || session.userId !== token.userId)
                throw new AuthError('ForbiddenOperationException', 'Invalid session. Invalid user id.', 204);
            if(config.user.profile.default.enable) {
                var texture = Texture.createTexture(token.userId, username, true, config.user.profile.default.skin, config.user.profile.default.slim, config.user.profile.default.cape);
                var property = UserProperty.createProperty(texture);
                var profile = UserProfile.createProfile(texture.profileId, texture.profileName, [property]);
                res.json(profile);
                res.end();
            } else {
                res.json(UserProfile.createProfile(token.userId, username, []));
                res.end();
            }
        })
        .catch(function (err) {
            if(err)
                err.status = 204;
            AuthError.response(res, err);
        });
};

module.exports = hasJoined;
