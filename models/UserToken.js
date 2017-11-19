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

var mysql = require('../util/mysql');

function UserToken(userToken) {
    this.accessToken = userToken.accessToken;
    this.clientToken = userToken.clientToken;
    this.userId = userToken.userId;
    this.timestamp = userToken.timestamp;
};

/**
 * Initialize User Token Model Table
 *
 * @returns {Promise}
 */
UserToken.initializeTable = function () {
    return mysql.query(
        'create table `user-token`(' +
        '`accessToken` varchar(32) not null unique,' +
        '`clientToken` varchar(32) not null,' +
        '`userId` varchar(32) not null,' +
        '`timestamp` bigint not null,' +
        'primary key(`accessToken`));')
};

module.exports = UserToken;
