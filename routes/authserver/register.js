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
var config = require('../../config');

var get = function (req, res) {
    if(!config.user.register.allow) {
        throw new AuthError('ForbiddenOperationException', I18n._('register.notAllow'), 403, undefined, true);
    } else {
        res.render('register', {
            title: I18n._('register.title'),
            subTitle: I18n._('register.subTitle'),
            username: I18n._('register.body.username'),
            password: I18n._('register.body.password'),
            email: I18n._('register.body.email'),
            submit: I18n._('register.body.submit')
        });
        res.end();
    }
};

var post = function (req, res) {
    var render = req.header('Content-Type') !== 'application/json';
    if(!config.user.register.allow) {
        throw new AuthError('ForbiddenOperationException', I18n._('register.notAllow'), 403, undefined, render);
    } else {
        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;

        Logger.info('User try register with username: ' + username);

        if(!username || !password)
            throw new AuthError('ForbiddenOperationException', I18n._('invalid.username_password'), 403, undefined, render);
        if(!Util.validateReg(config.user.register.regex.username, username, true))
            throw new AuthError('ForbiddenOperationException', I18n._('register.notAllow.username.{{format}}', {format: config.user.register.regex.username}), 403, undefined, render);
        if(!Util.validateReg(config.user.register.regex.password, password, true))
            throw new AuthError('ForbiddenOperationException', I18n._('register.notAllow.password.{{format}}', {format: config.user.register.regex.username}), 403, undefined, render);
        if(email && !Util.validateReg(config.user.register.regex.email, email, true))
            throw new AuthError('ForbiddenOperationException', I18n._('register.notAllow.email.{{format}}', {format: config.user.register.regex.username}), 403, undefined, render);

        User.findUserByName(username)
            .then(function (user) {
                if(user)
                    throw new AuthError('ForbiddenOperationException', I18n._('register.notAllow.account.exists'), 403);
                new User({
                    uuid: Util.randomUUID(true),
                    username: username,
                    password: User.securityPassword(password),
                    timestamp: Util.timestamp(),
                    email: email,
                    banned: 0 }).saveUser()
                    .then(function (user) {
                        Logger.info('User register succeed with username: ' + user.username);
                        if(render) {
                            res.render('registered', { title: I18n._('register.title'), subTitle: I18n._('register.success.subTitle'), username: user.username, uuid: user.uuid });
                            res.end();
                        } else {
                            res.json({ username: user.username, uuid: user.uuid });
                            res.end();
                        }
                    });
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
