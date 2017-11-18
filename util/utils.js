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
 * Gets the current timestamp in seconds
 *
 * @returns {number} timestamp
 */
var timestamp = function () {
    return Math.round(new Date().getTime() / 1000);
};

/**
 * Validate Token Timestamp
 *
 * @param {json} token config
 * @param {number} timestamp in seconds
 * @return {{}} state
 */
var validateToken = function (token, timestamp) {
    var time = Math.round(new Date().getTime() / 1000);
    var left = time - timestamp;
    var result = {};
    if(token.validity * 24 * 60 * 60 > left) {
        result.validity = true; // token validity
    } else if(token.temporarily * 24 * 60 * 60 > left) {
        result.temporarily = true; // token temporarily
    } else if(token.invalid * 24 * 60 * 60 <= left) {
        result.invalid = true; // token invalid
    }
    return result;
};

/**
 * Promise Of
 *
 * @param {function} [executor]
 * @returns {Promise}
 */
var ofPromise = function (executor) {
    if(!executor)
        executor = function (resolve, reject) { resolve(null); };
    return new Promise(executor);
};

module.exports = {
    timestamp: timestamp,
    validateToken: validateToken,
    ofPromise: ofPromise
};
