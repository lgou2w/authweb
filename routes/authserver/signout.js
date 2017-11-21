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
var User = require('../../models/User');
var UserToken = require('../../models/UserToken');

/**
 * POST request when the user needs to logout.
 *
 * @param {string} username
 * @param {string} password
 * @see POST /authserver/signout
 */
var signout = function (req, res) {

    // TODO Request Limit

    var username = req.body.username;
    var password = req.body.password;

    Logger.info('User signout with username: ' + username);

    if(!username || !password)
        throw new AuthError('ForbiddenOperationException', 'Invalid credentials. Invalid username or password.', 403);

    User.findUserByName(username)
        .then(function (user) {
            if(!user || !user.verifyPassword(password)) {
                throw new AuthError('ForbiddenOperationException', 'Invalid credentials. Invalid username or password.', 403);
            } else {
                UserToken.deleteTokensByUserId(user.uuid)
                    .then(function () {
                        res.status(204);
                        res.json({});
                        res.end();
                    })
            }
        })
        .catch(function (err) {
            AuthError.response(res, err);
        })
};

module.exports  = signout;
