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

var express = require('express')
var router = express.Router();

router.post('/sessionserver/session/minecraft/join', function (req, res) {
    var accessToken = req.body.accessToken;
    var selectedProfile = req.body.selectedProfile;
    var serverId = req.body.serverId;
    // TODO
    res.status(204);
    res.end();
});
router.get('/sessionserver/session/minecraft/hasJoined', function (req, res) {
    var serverId = req.query.serverId;
    var username = req.query.username;
    var ip = req.ip;
    // TODO
    res.json({ serverId: serverId, username: username, ip: ip });
});
router.get('/sessionserver/session/minecraft/profile/*', function (req, res) {
    var unsigned = req.query.unsigned || true;
    // TODO
    res.json({ uuid: req.params[0], unsigned: unsigned });
});

module.exports = router;
