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

var cache = require('memory-cache');
var config = require('../config.json');

/**
 * Default user session expiration time
 *
 * @type {number}
 */
const DEF_TIME = (config.user.session.timeout || 30) * 1000;

/**
 * User Session Model
 *
 * @constructor
 * @param {UserSession | {serverId: string, accessToken: string, userId: string, [ip]: string}} [userSession]
 */
function UserSession(userSession) {
    this.serverId = userSession.serverId;
    this.accessToken = userSession.accessToken;
    this.userId = userSession.userId;
    this.ip = userSession.ip;
};

/**
 * Create User Session
 *
 * @param {string} serverId
 * @param {string} accessToken
 * @param {string} userId
 * @param {string} ip
 * @return {UserSession}
 */
UserSession.createSession = function (serverId, accessToken, userId, ip) {
    return new UserSession({ serverId: serverId, accessToken: accessToken, userId: userId, ip: ip });
};

/**
 * Find User Session by Server Id
 *
 * @param {string} serverId
 * @return {UserSession | null}
 */
UserSession.findSessionByServerId = function (serverId) {
    return cache.get(serverId);
};

/**
 * Save User Session to Cache
 *
 * @param {function} [timeoutCallback]
 * @return {boolean} whether succeed
 */
UserSession.prototype.saveSession = function (timeoutCallback) {
    return cache.put(this.serverId, this, DEF_TIME, timeoutCallback) !== null;
};

module.exports = UserSession;
