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

var uuidV4 = require('uuid/v4');

function utils() {
}

/**
 * Gets the current timestamp in seconds
 *
 * @returns {number} timestamp
 */
utils.timestamp = function () {
    return Math.round(new Date().getTime() / 1000);
};

/**
 * Promise Of
 *
 * @param {function} [executor]
 * @returns {Promise}
 */
utils.ofPromise = function (executor) {
    if(!executor)
        executor = function (resolve, reject) { resolve(null); };
    return new Promise(executor);
};

/**
 * Random UUID
 *
 * @param {boolean} unsigned
 * @returns {string}
 */
utils.randomUUID = function (unsigned) {
    var result = uuidV4();
    if(unsigned)
        result = result.replace(/-/g, '');
    return result;
};

/**
 * Whether UUID
 *
 * @param {string} str
 * @param {boolean} unsigned
 * @return {boolean}
 */
utils.isUUID = function (str, unsigned) {
    if(!str || str === undefined)
        return false;
    if(unsigned === false)
        return /([0-9a-z]{8})-([0-9a-z]{4})-([0-9a-z]{4})-([0-9a-z]{4})-([0-9a-z]{12})/i.test(str);
    else
        return /([0-9a-z]{32,})/i.test(str);
};

module.exports = utils;
