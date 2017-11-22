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


/**
 * User Profile Model
 *
 * @constructor
 * @param {UserAuthentication | {accessToken: string, clientToken: string, selectedProfile: {id: string, name: string}, [availableProfiles]: array, [user]: {id: string}}} [userAuthentication]
 */
function UserAuthentication(userAuthentication) {
    this.accessToken = userAuthentication.accessToken;
    this.clientToken = userAuthentication.clientToken;
    this.selectedProfile = userAuthentication.selectedProfile;
    this.availableProfiles = userAuthentication.availableProfiles || [userAuthentication.selectedProfile];
    this.user = userAuthentication.user;
}

/**
 * Create User Profile
 *
 * @param {string} userId
 * @param {string} username
 * @param {string} accessToken
 * @param {string} clientToken
 * @returns {UserAuthentication}
 */
UserAuthentication.create = function (userId, username, accessToken, clientToken) {
    return new UserAuthentication({ accessToken: accessToken, clientToken: clientToken, selectedProfile: { id: userId, name: username }, user: { id: userId }});
};

module.exports = UserAuthentication;
