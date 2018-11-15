/**
 * 声明文件->代表js库的描述文件，可提供的接口内容
 *
 * 接口限定协议
 *
 * 接口实现标准
 */

interface Sleep {
	(time: number): void;
}

interface Convert {
	(name: string): string;
}

interface Version2Number {
	(version: string): number;
}

interface Number2Version {
	(num: number, count: number): string;
}

interface FormatDate {
	(date: Date, isDate: boolean): string
}

const sleep: Sleep = function(time: number): Promise<any> {
	return new Promise(function(resolve, reject) {
		setTimeout(function(){
			resolve();
		}, time);
	});
}

/**
 * 小驼峰转化为大驼峰
 */
const convertC2P: Convert = function(name: string): string {
	return name.charAt(0).toUpperCase() + name.substr(1);
}

/**
 * 大驼峰转化为小驼峰
 */
const convertP2C: Convert = function(name: string): string {
	return name.charAt(0).toLowerCase() + name.substr(1);
}

/**
 * 小驼峰转化为匈牙利
 */
const convertC2_: Convert = function(name: string): string {
	return name.replace(/[A-Z]/g, c => "_" + c.toLowerCase());
}

/**
 * 匈牙利转化为小驼峰
 */
const convert_2C: Convert = function(name: string): string {
	return name.replace(/_\w/g, c => c.charAt(1).toUpperCase());
}

/**
 * 版本号数字转化
 * 版本号每段数字不能超过255
 * 版本号最多支持8段
 */
const version2Number: Version2Number = function(version: string): number {
	let number = 0;
	let vs = version.split(".");
	vs.forEach((v, i) => {
		let _v: number = parseInt(v);
		if (_v >= 0 || _v <= 255) {
			number += Math.pow(256, vs.length - i - 1) * _v;
		}
	});

	return number;
}

/**
 * 数字转化为版本号
 * 默认5段，每段不超过255
 */
const number2Version: Number2Version = function(number: number, count=5): string {
	let vs = [];

	for (let i = count; i >= 1; i--) {
		vs.push(Math.round(number / Math.pow(256, i - 1)) % 256);
	}

	return vs.join(".");
}


/**
 * 时间格式化工具
 */
const formatDate: FormatDate = function(date: Date, isDate: true): string {

	return isDate ? (date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()) : (date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
}

export default {
	convertC2P: convertC2P,
	convertP2C: convertP2C,
	convertC2_: convertC2_,
	convert_2C: convert_2C,
	number2Version: number2Version,
	version2Number: version2Number,
	formatDate: formatDate,
	sleep: sleep
};
