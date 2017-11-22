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

var Texture = require('./Texture');

const PROPERTY_NAME = 'textures';

/**
 * User Property Model
 *
 * @constructor
 * @param {UserProperty | {name: string, value: string, [signature]: string}} [userProperty]
 */
function UserProperty(userProperty) {
    this.name = userProperty.name;
    this.value = userProperty.value;
    this.signature = userProperty.signature;
}

/**
 * Create User Property
 *
 * @param {Texture} texture
 * @param {string} [signature]
 * @param {string} [name]
 */
UserProperty.createProperty = function (texture, signature, name) {
    if(!name)
        name = PROPERTY_NAME;
    return new UserProperty({ name: name, value: texture.toBase64(), signature: signature });
};

UserProperty.OWNER = UserProperty.createProperty(Texture.OWNER);

module.exports = UserProperty;
