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
 * POST request when the client connects to the server.
 *
 * @param {string} accessToken
 * @param {string} selectedProfile
 * @param {string} serverId
 * @return If successful, return to http 204 state.
 * @see POST /yggdrasil/sessionserver/session/minecraft/join
 */
var join = function (req, res) {
    var accessToken = req.body.accessToken;
    var selectedProfile = req.body.selectedProfile;
    var serverId = req.body.serverId;
    var ip = req.ip;
    // TODO
    res.status(204);
    res.end();
};

module.exports = join;
