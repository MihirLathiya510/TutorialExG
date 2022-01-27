const otp = require('otp-generator');

const onetimepassword = otp.generate(6, { upperCaseAlphabets: false, specialChars: false });

module.exports = onetimepassword;
