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
var config = require('../../config.json');

var get = function (req, res) {
    if(!config.user.register.allow) {
        res.status(404);
        res.end();
    } else {
        res.render('register', { title: 'User Register - AuthWeb' });
        res.end();
    }
};

var post = function (req, res) {
    if(!config.user.register.allow) {
        res.status(404);
        res.end();
    } else {
        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;
        var render = req.header('Content-Type') !== 'application/json';

        Logger.info('User try register with username: ' + username);

        if(!username || !password)
            throw new AuthError('ForbiddenOperationException', 'Invalid username or password', 403, undefined, render);
        if(!Util.validateReg(config.user.register.regex.username, username))
            throw new AuthError('ForbiddenOperationException', 'Invalid username. Not allowed format. (\'' + config.user.register.regex.username + '\')', 403, undefined, render);
        if(!Util.validateReg(config.user.register.regex.password, password))
            throw new AuthError('ForbiddenOperationException', 'Invalid password. Not allowed format. (\'' + config.user.register.regex.password + '\')', 403, undefined, render);
        if(email && !Util.validateReg(config.user.register.regex.email, email))
            throw new AuthError('ForbiddenOperationException', 'Invalid email. Not allowed format. (\'' + config.user.register.regex.email + '\')', 403, undefined, render);

        User.findUserByName(username)
            .then(function (user) {
                if(user)
                    throw new AuthError('ForbiddenOperationException', 'Invalid username. User already exists.', 403);
                // TODO save user
                res.json({ succeed: 1, body: req.body });
                res.end();
            })
            .catch(function (err) {
                if(err instanceof AuthError)
                    err.render = render;
                AuthError.response(res, err);
            });
    }
};

module.exports = {
    get: get,
    post: post
};
