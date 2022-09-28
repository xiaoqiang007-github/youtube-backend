const crypto = require('crypto');
const _ = require('lodash');

exports.md5 = function (data) {
    return crypto.createHash('md5').update(data).digest('hex');
}

exports._ = _
