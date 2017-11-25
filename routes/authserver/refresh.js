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
var I18n = require('../../util/I18n');
var User = require('../../models/User');
var UserToken = require('../../models/UserToken');
var UserAuthentication = require('../../models/UserAuthentication');
var config = require('../../config');

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
        throw new AuthError('ForbiddenOperationException', I18n._('invalid.accessToken.orUnsigned'), 403);
    if(!config.user.profile.allowSelecting && selectedProfile)
        throw new AuthError('ForbiddenOperationException', I18n._('profile.accessToken.assigned'), 403);

    UserToken.findTokenByAccess(accessToken)
        .then(function (token) {
            if(!token || !token.isValidElseDelete(true) || (clientToken && token.clientToken !== clientToken)) {
                throw new AuthError('ForbiddenOperationException', I18n._('invalid.token.orExpired'), 403)
            } else {
                User.findUserByUUID(token.userId)
                    .then(function (user) {
                        if(user.banned)
                            throw new AuthError('ForbiddenOperationException', I18n._('account.banned'), 403);
                        if(clientToken && token.clientToken === clientToken) {
                            return UserToken.updateTokenByClient(user.userId, token.clientToken)
                                .then(function (token) {
                                    return UserAuthentication.create(user.uuid, user.username, token.accessToken, token.clientToken, requestUser);
                                });
                        } else {
                            return UserToken.deleteTokenByAccess(token.accessToken)
                                .then(function () {
                                    return UserToken.createToken(user.uuid, token.clientToken).saveToken()
                                        .then(function (token) {
                                            return UserAuthentication.create(user.uuid, user.username, token.accessToken, token.clientToken, requestUser);
                                        });
                                });
                        }
                    })
                    .then(function (authentication) {
                        res.json(authentication);
                        res.end();
                    })
            }
        })
        .catch(function (err) {
            AuthError.response(res, err);
        });
};

module.exports  = refresh;
