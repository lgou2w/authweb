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

router.get('/', function (req, res) {
    var content = {
        title: 'AuthWeb',
        link: 'https://github.com/McMoonLakeDevAuth/authweb',
        subTitle: 'A Minecraft Yggdrasil Web Server of Node.js',
        message: 'by lgou2w'
    };
    res.render('index', content);
    res.end();
});

module.exports = router;
