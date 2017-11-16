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
 * GET request when the client queries for user profile.
 *
 * @param {string} uuid
 * @param {boolean} [unsigned]
 * @see GET /yggdrasil/sessionserver/session/minecraft/profile/{uuid}
 */
var profile =  function (req, res) {
    var unsigned = req.query.unsigned || true;
    // TODO
    res.json({ uuid: req.params[0], unsigned: unsigned });
};

module.exports = profile;
