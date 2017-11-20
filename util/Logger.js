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

var log4js = require('log4js');

log4js.configure({
    appenders: {
        console: { type: 'console' },
        log: { type: 'file', filename: 'logs/authweb.log' },
        logs: { type: 'dateFile', filename: 'logs/authweb-', pattern: 'yyyy-MM-dd.log', alwaysIncludePattern: true }
    },
    categories: {
        authweb: { appenders: ['console', 'log', 'logs'], level: 'info' },
        default: { appenders: ['console', 'log', 'logs'], level: 'debug' }
    }
});

function Logger() {
}

Logger.log4js = log4js;
Logger.logger = log4js.getLogger('console');
Logger.authweb = log4js.getLogger('authweb');

Logger.debug = function (message) {
   Logger.logger.debug(message);
};

Logger.info = function (message) {
    Logger.logger.info(message);
};

Logger.warn = function (message) {
    Logger.logger.warn(message);
};

Logger.error = function (message) {
    Logger.logger.error(message);
};

module.exports = Logger;
