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

/**
 * POST request when revoking a token.
 *
 * @param {string} accessToken
 * @param {string} [clientToken]
 */
var invalidate = function (req, res) {

    var accessToken = req.body.accessToken;
    var clientToken = req.body.clientToken;

    Logger.info('User invalidate token with accessToken: ' + accessToken);

    if(!Util.isUUID(accessToken, true))
        throw new AuthError('ForbiddenOperationException', 'Invalid access token or Non-unsigned UUID format.', 204);

    UserToken.findTokenByAccess(accessToken)
        .then(function (token) {
            if(!token || (clientToken && token.clientToken !== clientToken)) {
                throw new AuthError('ForbiddenOperationException', 'Invalid token.', 204);
            } else {
                UserToken.deleteTokenByAccess(token.accessToken)
                    .then(function () {
                        res.status(204);
                        res.json({});
                        res.end();
                    });
            }
        })
        .catch(function (err) {
            if(err)
                err.status = 204;
            AuthError.response(res, err);
        });
};

module.exports  = invalidate;
