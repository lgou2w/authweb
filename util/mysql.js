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

var mysql = require('mysql');
var config = require('../config');
var pool = mysql.createPool(config.mysql);

/**
 * Query MySQL
 *
 * @param {string} sql
 * @param {array} [args]
 * @param {function} callback
 */
var query = function (sql, args, callback) {
    pool.getConnection(function (err, conn) {
        if(err) {
            reject(err);
        } else {
            conn.query(sql, args, function (err, values, fields) {
                conn.release();
                callback(err, values, fields);
            });
        }
    });
};

/**
 * Query Promise MySQL
 *
 * @param {string} sql
 * @param {array} [args]
 * @return {Promise}
 */
var queryPromise = function (sql, args) {
    return new Promise(function (resolve, reject) {
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
 * @param {function} [callback]
 */
var end = function (callback) {
    pool.end(callback);
};

/**
 * Test MySQL
 *
 * @param {function} [callback]
 */
var test = function (callback) {
    pool.getConnection(function (err, conn) {
        if(err) {
            callback(err);
        } else {
            callback(null);
            pool.releaseConnection(conn);
        }
    })
};

module.exports = {
    self: mysql,
    query: query,
    queryPromise: queryPromise,
    end: end,
    test: test
};
