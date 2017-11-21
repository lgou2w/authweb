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
 * POST request when the verification token is valid
 *
 * @param {string} accessToken
 * @param {string} [clientToken]
 * @see POST /authserver/validate
 */
var validate = function (req, res) {

    var accessToken = req.body.accessToken;
    var clientToken = req.body.clientToken;

    Logger.info('User validate token with accessToken: ' + accessToken);

    if(!Util.isUUID(accessToken, true))
        throw new AuthError('ForbiddenOperationException', 'Invalid access token or Non-unsigned UUID format.', 403);
    if(clientToken && !Util.isUUID(clientToken, true))
        throw new AuthError('ForbiddenOperationException', 'Invalid client token. Non-unsigned UUID format.', 403);

    UserToken.findTokenByAccess(accessToken)
        .then(function (token) {
            if(!token || !token.validate(accessToken, clientToken)) {
                throw new AuthError('ForbiddenOperationException', 'Invalid token or expired.', 403)
            } else {
                res.status(204);
                res.json({});
                res.end();
            }
        })
        .catch(function (err) {
            AuthError.response(res, err);
        })
};

module.exports  = validate;
