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
var config =require('../config');

const BASE_URL = 'http://' + config.http.host + '/textures/';

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
 * @param {number} [timestamp]
 * @returns {Texture}
 */
Texture.createTexture = function (profileId, profileName, signatureRequired, skin, slim, cape, timestamp) {
    var textures = {};
    if(skin)
        textures.SKIN = Model.create(skin, slim ? { model: 'slim' } : undefined);
    if(cape)
        textures.CAPE = Model.create(cape);
    return new Texture({
        timestamp: timestamp || Util.timestamp(),
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
 * @param {json} [metadata]
 * @returns {Model}
 */
Texture.Model.create = function (url, metadata) {
    return new Model({ url: url, metadata: metadata });
};

/** Default Skin */
Texture.SKIN_NOTCH = '9c5ceddbebff901e568f02d70e699bebc7e4169d91dbf2fdc0a1e32df496008a';
Texture.SKIN_JEB = 'a96c2ee5f0590116609229dc85465ce8844f7e9e51e8fd7b1550e6752ce79148';
Texture.SKIN_STEVE = '9549596ad015e015cb7ae5ce59b5d1750fef08f3f9a85c16ecdbd3cf7dc7f365';
Texture.SKIN_ALEX = 'df8ed96c557d441a63e7b6a4a911ab84fa453b42fc2ae6b01c3e1b02e138168c';
Texture.SKIN_OWNER = 'e2ade6626ce05936fde2fd6be82676c127095b8a8bacff0adca8362719536076';

/** Default Cape */
Texture.CAPE_MINECON_2016 = 'e7dfea16dc83c97df01a12fabbd1216359c0cd0ea42f9999b6e97c584963e980';
Texture.CAPE_MINECON_2015 = 'b0cc08840700447322d953a02b965f1d65a13a603bf64b17c803c21446fe1635';
Texture.CAPE_MINECON_2013 = '153b1a0dfcbae953cdeb6f2c2bf6bf79943239b1372780da44bcbb29273131da';
Texture.CAPE_MINECON_2012 = 'a2e8d97ec79100e90a75d369d1b3ba81273c4f82bc1b737e934eed4a854be1b6';
Texture.CAPE_MINECON_2011 = '953cac8b779fe41383e675ee2b86071a71658f2180f56fbce8aa315ea70e2ed6';
Texture.CAPE_REALMS_MAPMAKER = '17912790ff164b93196f08ba71d0e62129304776d0f347334f8a6eae509f8a56';
Texture.CAPE_MOJANG = '5786fe99be377dfb6858859f926c4dbc995751e91cee373468c5fbf4865e7151';
Texture.CAPE_TRANSLATOR = '1bf91499701404e21bd46b0191d63239a4ef76ebde88d27e4d430ac211df681e';
Texture.CAPE_MOJIRA_MODERATOR = 'ae677f7d98ac70a533713518416df4452fe5700365c09cf45d0d156ea9396551';
Texture.CAPE_COBALT = '0ca35c56efe71ed290385f4ab5346a1826b546a54d519e6a3ff01efa01acce81';
Texture.CAPE_SCROLLS = '3efadf6510961830f9fcc077f19b4daf286d502b5f5aafbd807c7bbffcaca245';
Texture.CAPE_MOJANG_CLASSIC = '8f120319222a9f4a104e2f5cb97b2cda93199a2ee9e1585cb8d09d6f687cb761';
Texture.CAPE_DANNY_BSTYLE = 'bcfbe84c6542a4a5c213c1cacf8979b5e913dcb4ad783a8b80e3c4a7d5c8bdac';
Texture.CAPE_JULIAN_CLARK = '23ec737f18bfe4b547c95935fc297dd767bb84ee55bfd855144d279ac9bfd9fe';
Texture.CAPE_MILLIONTH_CUSTOMER = '70efffaf86fe5bc089608d3cb297d3e276b9eb7a8f9f2fe6659c23a2d8b18edf';
Texture.CAPE_MRMESSIAH = '2e002d5e1758e79ba51d08d92a0f3a95119f2f435ae7704916507b6c565a7da8';
Texture.CAPE_PRISMARINE = 'd8f8d13a1adf9636a16c31d47f3ecc9bb8d8533108aa5ad2a01b13b1a0c55eac';

/** Default Texture of Owner */
Texture.OWNER = Texture.createTexture('e948f0b3c9be4909a176f13720d3be4c', 'Month_Light', true, Texture.SKIN_OWNER, true, Texture.CAPE_MINECON_2016);

module.exports = Texture;
