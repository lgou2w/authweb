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

// Note: This is the JSON format
// 注意: 这是 JSON 格式

module.exports = {

    // Http server settings
    // Http 服务器设置
    http: {
        host: 'localhost',
        port: 8080
    },

    // MySQL settings
    // MySQL 设置
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'moonlake',
        database: 'authweb'
    },

    // User settings
    // 用户设置
    user: {
        // User registration
        // 用户注册
        register: {
            // Whether to allow registration
            // 是否允许注册
            allow: true,
            // Registration field values match. The value of '' matches all
            // 注册时字段值的匹配. 值为 '' 则匹配全部
            regex: {
                // Username, It is recommended not to exceed 16 length because the database uses VARCHAR (16)
                // 用户名, 建议不要超过16个长度, 因为数据库使用的是 VARCHAR(16)
                username: /^([0-9a-zA-Z_]{3,16})$/,
                password: /^[0-9a-zA-Z!@#$%^&*]{6,21}$/,
                email: /^\w+@\w+\.\w+$/
            }
        },
        // User password storage mode (See below)
        // 用户密码存储模式 (见下)
        password: 'SHA256WithSalt',
        // User password available storage mode (Case sensitive)
        // It is recommended to use SHA512WithSalt with high strength
        // ) Raw: Clear text password
        // ) MD5: Password MD5 Hash
        // ) SHA256: Password Sha-256 Hash
        // ) SHA512: Password Sha-512 Hash
        // ) MD5WithSalt: Password MD5 hash plus salt (Result: {Salt}${PasswordHash})
        // ) SHA256WithSalt: Password Sha-256 hash plus salt (Result: {Salt}${PasswordHash})
        // ) SHA512WithSalt: Password Sha-512 hash plus salt (Result: {Salt}${PasswordHash})
        passwords: [
            'Raw', 'MD5', 'SHA256', 'SHA512', 'MD5WithSalt', 'SHA256WithSalt', 'SHA512WithSalt'
        ],
        // User token settings
        // 用户令牌设置
        token: {
            // The maximum number of user tokens held
            // 用户最大令牌持有数量
            max: 5,
            // User token valid time (seconds)
            // 用户令牌有效时间 (秒)
            valid: 259200,
            // User token invalid time (seconds)
            // 用户令牌过期时间 (秒)
            invalid: 604800
        },
        // User session settings
        // 用户会话设置
        session: {
            // Session expiration time (seconds)
            // 会话过期时间 (秒)
            timeout: 30
        },
        // User profile settings
        // 用户档案设置
        profile: {
            // Whether to allow choice. If false, the body has the selectedProfile property when the request is refresh, access is forbidden (See: multi-role)
            // 是否允许选择. 如果为 false, 当刷新请求时 body 具有 selectedProfile 属性, 那么会被禁止访问 (见: 多角色)
            allowSelecting: false,
            // Default profile settings
            // 默认档案设置
            default: {
                // Whether to enable this
                // 是否开启此功能
                enable: true,
                // Default skin and cape hash. You can see here comes with
                // 默认皮肤和披风哈希. 你可以到这里查看自带的
                // https://github.com/McMoonLakeDevAuth/authweb/blob/master/models/Texture.js#L102-L126
                skin: '9c5ceddbebff901e568f02d70e699bebc7e4169d91dbf2fdc0a1e32df496008a',
                cape: '5786fe99be377dfb6858859f926c4dbc995751e91cee373468c5fbf4865e7151',
                // Whether to use the slim skin model
                // 皮肤是否使用纤细模型
                slim: false
            },
        }
    }

};
