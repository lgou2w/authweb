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
var UserProfile = require('../../models/UserProfile');
var UserProperty = require('../../models/UserProperty');
var Texture = require('../../models/Texture');
var config = require('../../config');

/**
 * GET request when the client queries for user profile.
 *
 * @param {string} uuid
 * @param {boolean} [unsigned]
 * @see GET /sessionserver/session/minecraft/profile/{uuid}
 */
var profile =  function (req, res) {
    var uuid = req.params[0];
    var unsigned = req.query.unsigned || true;

    Logger.info('User get profile with uuid: ' + uuid);

    if(!uuid || !Util.isUUID(uuid, true))
        throw new AuthError('ForbiddenOperationException', 'Invalid uuid or Non-unsigned UUID format.', 204);

    User.findUserByUUID(uuid)
        .then(function (user) {
            if(!user)
                throw new AuthError('ForbiddenOperationException', 'Invalid uuid. User does not exist.', 204);
            if(config.user.profile.default.enable) {
                var texture = Texture.createTexture(user.uuid, user.username, unsigned, config.user.profile.default.skin, config.user.profile.default.slim, config.user.profile.default.cape);
                var property = UserProperty.createProperty(texture);
                var profile = UserProfile.createProfile(texture.profileId, texture.profileName, [property]);
                res.json(profile);
                res.end();
            } else {
                res.json(UserProfile.createProfile(user.uuid, user.username, []));
                res.end();
            }
        })
        .catch(function (err) {
            if(err)
                err.status = 204;
            AuthError.response(res, err);
        });
};

module.exports = profile;
