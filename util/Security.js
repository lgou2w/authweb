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

var crypto = require('crypto');

function Security() {
}

/**
 * Generate the SHA-1 digest of the given message.
 *
 * @param {string} message
 * @returns {string}
 */
Security.sha1 = function (message) {
    return hash('sha1', message);
};

/**
 * Generate the SHA-256 digest of the given message.
 *
 * @param {string} message
 * @returns {string}
 */
Security.sha256 = function (message) {
    return hash('sha256', message);
};

/**
 * Generate the SHA-512 digest of the given message.
 *
 * @param {string} message
 * @returns {string}
 */
Security.sha512 = function (message) {
    return hash('sha512', message);
};

/**
 * Generate the MD5 digest of the given message.
 *
 * @param {string} message
 * @returns {string}
 */
Security.md5 = function (message) {
    return hash('md5', message);
};

function hash(algorithm, message) {
    var hash = crypto.createHash(algorithm);
    hash.update(message);
    return hash.digest('hex');
}

module.exports = Security;
