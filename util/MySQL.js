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

var Util = require('./Util');
var Logger = require('./Logger');
var mysql = require('mysql');
var config = require('../config.json');
var pool = mysql.createPool(config.mysql);

function MySQL() {
}

/**
 * MySQL Pool
 *
 * @type {Pool}
 */
MySQL.pool = pool;

/**
 * Query MySQL
 *
 * @param {string} sql
 * @param {array} [args]
 * @return {Promise}
 */
MySQL.query = function (sql, args) {
    return Util.ofPromise(function (resolve, reject) {
        pool.getConnection(function (err, conn) {
            if(err) {
                reject(err);
            } else {
                conn.query(sql, args, function (err, values, fields) {
                    conn.release();
                    if(err) {
                        reject(err);
                    } else {
                        resolve({ 'values': values, 'fields': fields });
                    }
                });
            }
        });
    });
};

/**
 * End MySQL
 *
 * @return {Promise}
 */
MySQL.end = function () {
    return Util.ofPromise(function (resolve, reject) {
        pool.end(function (err) {
            if(err) reject(err);
            else resolve();
        })
    })
};

/**
 * Initialize MySQL
 *
 * @return {Promise}
 */
MySQL.initialize = function () {
    return Util.ofPromise(function (resolve, reject) {
        pool.getConnection(function (err, conn) {
            if(err) {
                if(err.code && err.code === 'ER_BAD_DB_ERROR') {
                    Logger.warn('Unable to connect to the MySQL. No database found: ' + config.mysql.database);
                    var conn0 = mysql.createConnection({
                        host: config.mysql.host,
                        port: config.mysql.port,
                        user: config.mysql.user,
                        password: config.mysql.password,
                        database: 'mysql'
                    });
                    conn0.query('create database if not exists ' + config.mysql.database + ';', function (err) {
                        conn0.end();
                        if(err) {
                            reject(err);
                        } else {
                            Logger.info('> Successfully created the database. Initialize the table...');
                            require('../models/User').initializeTable()
                                .then(function () {
                                    Logger.info('> User model table initialization completed.');
                                })
                                .then(function () {
                                    return require('../models/UserToken').initializeTable()
                                        .then(function () {
                                            Logger.info('> UserToken model table initialization completed.');
                                        })
                                })
                                .then(function () {
                                    Logger.info('> All data model initialization is completed.')
                                    resolve();
                                })
                                .catch(function (err) {
                                    reject(err)
                                });
                        }
                    });
                } else {
                    reject(err);
                }
            } else {
                pool.releaseConnection(conn);
                resolve();
            }
        })
    })
};

module.exports = MySQL;
