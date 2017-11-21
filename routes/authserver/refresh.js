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
 * POST request when user refreshes token.
 *
 * @param {string} accessToken
 * @param {string} [clientToken]
 * @param {boolean} requestUser
 * @param {json} selectedProfile
 * @param           {string} id
 * @param           {string} username
 * @see POST /authserver/refresh
 */
var refresh = function (req, res) {

    var accessToken = req.body.accessToken;
    var clientToken = req.body.clientToken;
    var requestUser = req.body.requestUser || false;
    var selectedProfile = req.body.selectedProfile;

    Logger.info('User refresh with accessToken: ' + accessToken);

    if(!Util.isUUID(accessToken, true))
        throw new AuthError('ForbiddenOperationException', 'Invalid access token or Non-unsigned UUID format.', 403);
    if(clientToken && !Util.isUUID(clientToken, true))
        throw new AuthError('ForbiddenOperationException', 'Invalid client token. Non-unsigned UUID format.', 403);
    if(!req.app.get('config').user.allowSelectingProfile && selectedProfile)
        throw new AuthError('ForbiddenOperationException', 'Access token already has a profile assigned.', 403);

    UserToken.findTokenByAccess(accessToken)
        .then(function (token) {
            if(!token || (clientToken && token.clientToken !== clientToken)) {
                throw new AuthError('ForbiddenOperationException', 'Invalid token.', 403)
            } else {
                User.findUserByUUID(token.userId)
                    .then(function (user) {
                        if(user.banned)
                            throw new AuthError('ForbiddenOperationException', 'Account has been banned.', 403);
                        var result = { userId: user.uuid, username: user.username };
                        UserToken.deleteTokenByAccess(token.accessToken)
                            .then(function () {
                                UserToken.createToken(user.uuid, token.clientToken).saveToken()
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
                            });
                    })
            }
        })
        .catch(function (err) {
            AuthError.response(res, err);
        });
};

module.exports  = refresh;
