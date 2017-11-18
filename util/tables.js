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

var config = require('../config');
var mysql = require('util/mysql');

var initialize = function (callback) {
    createDatabase(callback);
    createUser(callback);
    createUserToken(callback);
};

function createDatabase(callback) {
    var mysql = require('mysql');
    var mysqlConfig = config.mysql;
    var conn = mysql.createConnection({
        host: mysqlConfig.host,
        port: mysqlConfig.port,
        user: mysqlConfig.user,
        password: mysqlConfig.password,
        database: 'mysql'
    });
    conn.query('create database if not exists ?;', mysqlConfig.database, function (err) {
        conn.release();
        if(err) callback(err);
        else console.info('MySQL database initialized.');
        mysql.end(callback);
    });
};

function createUser(callback) {
    var sql = '' +
        'create table `user`(' +
        'id int auto_increment,' +
        'uuid varchar(32) not null unique,' +
        'username varchar(16) not null,' +
        'password varchar(255) not null,' +
        'timestamp bigint not null,' +
        'email varchar(255) default \'NONE\' not null,' +
        'primary key(id, uuid));';
    mysql.query(sql, callback);
};

function createUserToken(callback) {
    var sql = '' +
        'create table `user`(' +
        'id int auto_increment,' +
        'accessToken varchar(255) not null unique,' +
        'clientToken varchar(255) not null' +
        'userId varchar(32) not null unique,' +
        'timestamp bigint not null,' +
        'primary key(id, accessToken));';
    mysql.query(sql, callback);
}

module.exports = {
    initalize: initialize
};
