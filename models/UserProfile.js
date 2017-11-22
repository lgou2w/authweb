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

var Texture = require('./Texture');
var UserProperty = require('./UserProperty');

/**
 * User Profile Model
 *
 * @constructor
 * @param {UserProfile | {id: string, name: string, [properties]: array}} userProfile
 */
function UserProfile(userProfile) {
    this.id = userProfile.id;
    this.name = userProfile.name;
    this.properties = userProfile.properties || [];
}

/**
 * Create User Profile
 *
 * @param {string} id
 * @param {string} name
 * @param {array} properties
 * @returns {UserProfile}
 */
UserProfile.createProfile = function (id, name, properties) {
    return new UserProfile({ id: id, name: name, properties: properties });
};

UserProfile.OWNER = UserProfile.createProfile(Texture.OWNER.profileId, Texture.OWNER.profileName, [UserProperty.OWNER]);

module.exports = UserProfile;
