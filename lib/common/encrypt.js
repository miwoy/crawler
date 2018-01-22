const crypto = require("crypto");

/**
 * 创建salt，生成5位随机字符串
 * @returns {string}
 */
function createSalt() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 5; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

/**
 * md5加密
 * @param password
 * @param salt
 * @returns {*}
 */
function md5(password, salt) {
	let secret = password + (salt || "");

	return crypto.createHash("md5")
		.update(secret)
		.digest("hex");
}

/**
 * ase加密算法
 * @param str
 * @param secret
 * @returns {*}
 */
function aseEncrypt(str, secret) {
	let cipher = crypto.createCipher("aes192", secret);
	let enc = cipher.update(str, "utf8", "hex"); //编码 式从utf-8转为hex;
	enc += cipher.final("hex"); //编码 式从转为hex;
	return enc;
}
/**
 * ase解密算法
 * @param enc
 * @param secret
 * @returns {*}
 */
function aseDecrypt(enc, secret) {
	let decipher = crypto.createDecipher("aes192", secret);
	let str = decipher.update(enc, "hex", "utf8"); //编码 式从hex转为utf-8;
	str += decipher.final("utf8"); //编码 式从utf-8;
	return str;
}




module.exports = {
	createSalt: createSalt,
	md5: md5,
	aseEncrypt: aseEncrypt,
	aseDecrypt: aseDecrypt
};
