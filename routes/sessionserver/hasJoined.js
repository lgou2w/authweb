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

var Util = require('../../util/Util');
var Texture = require('../../util/Texture');

/**
 * GET request when the server authenticates the client.
 *
 * @param {string} serverId
 * @param {string} username
 * @param {string} [ip]
 * @return If failed, return to http state 204.
 * @see GET /sessionserver/session/minecraft/hasJoined
 */
var hasJoined = function (req, res) {
    var serverId = req.query.serverId;
    var username = req.query.username;
    var ip = req.query.ip;
    res.json({});
};

module.exports = hasJoined;
