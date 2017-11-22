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

var Util = require('../util/Util');
var config =require('../config.json');

const BASE_URL = (config.http.https ? 'https' : 'http') + '://' + config.http.host + '/textures/';
const SKIN_STEVE = '9549596ad015e015cb7ae5ce59b5d1750fef08f3f9a85c16ecdbd3cf7dc7f365';
const SKIN_ALEX = 'df8ed96c557d441a63e7b6a4a911ab84fa453b42fc2ae6b01c3e1b02e138168c';
const SKIN_OWNER = 'e2ade6626ce05936fde2fd6be82676c127095b8a8bacff0adca8362719536076';
const CAPE_MINECON_2016 = '5c3ca7ee2a498f1b5d258d5fa927e63e433143add5538cf63b6a9b78ae735';

/**
 * Texture Model
 *
 * @constructor
 * @param {Texture | {timestamp: number, profileId: string, profileName: string, signatureRequired: boolean, [textures]: {}}} [texture]
 */
function Texture(texture) {
    this.timestamp = texture.timestamp;
    this.profileId = texture.profileId;
    this.profileName = texture.profileName;
    this.signatureRequired = texture.signatureRequired;
    this.textures = texture.textures || {};
}

/**
 * Texture Model's
 *
 * @constructor
 * @param {Model | {url: string, [metadata]: json}} [model]
 */
function Model(model) {
    this.url = model.url ? BASE_URL + model.url : undefined;
    this.metadata = model.metadata;
}

/**
 * Texture Model's
 *
 * @type {Model}
 */
Texture.Model = Model;

/**
 * Texture to Base64
 *
 * @returns {String}
 */
Texture.prototype.toBase64 = function () {
    return new Buffer(JSON.stringify(this)).toString('base64');
};

/**
 * Create Texture with Skin and Cape
 *
 * @param {string} profileId
 * @param {string} profileName
 * @param {boolean} signatureRequired
 * @param {string} skin
 * @param {boolean} slim
 * @param {string} [cape]
 * @returns {Texture}
 */
Texture.createTexture = function (profileId, profileName, signatureRequired, skin, slim, cape) {
    var textures = {};
    if(skin)
        textures.SKIN = Model.create(skin, slim ? { model: 'slim' } : {});
    if(cape)
        textures.CAPE = Model.create(cape);
    return new Texture({
        timestamp: Util.timestamp(),
        profileId: profileId,
        profileName: profileName,
        signatureRequired: signatureRequired,
        textures: textures
    });
};

/**
 * Create Texture Model
 *
 * @param {string} url
 * @param {json} metadata
 * @returns {Model}
 */
Texture.Model.create = function (url, metadata) {
    return new Model({ url: url, metadata: metadata });
};

Texture.SKIN_STEVE = SKIN_STEVE;
Texture.SKIN_ALEX = SKIN_ALEX;
Texture.CAPE_MINECON_2016 = CAPE_MINECON_2016;
Texture.OWNER = Texture.createTexture('e948f0b3c9be4909a176f13720d3be4c', 'Month_Light', true, SKIN_OWNER, true, CAPE_MINECON_2016);

module.exports = Texture;
