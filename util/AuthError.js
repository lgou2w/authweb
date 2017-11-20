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

var Logger = require('./Logger');
var util = require('util');

function AuthError(error, message, status, cause) {
    Error.call(this);
    this.error = error;
    this.message = message;
    this.status = status;
    this.cause = cause;
};

util.inherits(AuthError, Error);

AuthError.response = function (res, error, message, status, cause) {
    if(error instanceof AuthError) {
        Logger.error('Error: ' + error.error + ': ' + error.message);
        res.status(error.status || 500);
        res.json({ error: error.error, errorMessage: error.message, cause: error.cause });
        res.end();
    } else {
        Logger.error('Error: ' + error + ': ' + message);
        console.error(error);
        res.status(status || 500);
        res.json({ error: error, errorMessage: message, cause: cause });
        res.end();
    }
};

module.exports = AuthError;
