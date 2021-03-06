let http = require("http");
let https = require("https");
let urlutil = require("url");
let Debug = require("debug");

const debug = Debug("crawler:request");

let get = function(url, query, opts) {
	opts = opts || {};
	opts.ContentType = opts.ContentType || "JSON";
	let queryArry = [];
	for (let key in query) {
		query[key] = typeof query[key] == "object" ? JSON.stringify(query[key]) : query[key];
		queryArry.push(key + "=" + encodeURIComponent(query[key]));
	}

	if (queryArry.length > 0)
		url += "?" + queryArry.join("&");
	debug("GET " + url);
	return new Promise(function(resolve, reject) {
		let req = http;
		if (url.slice(0, 5) === "https") req = https;
		let _opts = urlutil.parse(url, false, true);
		_opts.method = "GET";
		_opts.headers = {
			"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36"
		}

		req.get(_opts, (res) => {
			const statusCode = res.statusCode;
			const contentType = res.headers["content-type"];
			let error;
			if (!(statusCode == 200 || statusCode == 301)) {
				error = new Error("请求失败。\n" +
					`状态码: ${statusCode}`);
			}
			
			if (error) {
				// 消耗响应数据以释放内存
				res.resume();
				return reject(error);
			}

			res.setEncoding("utf8");
			let rawData = "";
			res.on("data", (chunk) => rawData += chunk);
			res.on("end", () => {
				try {
					let parsedData = rawData;
					if (opts.ContentType === "JSON") {
						parsedData = JSON.parse(rawData);
					}

					if (parsedData.errno) {
						reject(new Error(parsedData.errmsg));
					} else {
						resolve(parsedData);
					}

				} catch (e) {
					reject(e);
				}
			});
		}).on("error", (e) => {
			reject(e);
		});
	});

};

let post = function(url, data) {
	return new Promise(function(resolve, reject) {
		let reqx = http;
		if (url.slice(0, 5) === "https") reqx = https;
		var postData = JSON.stringify(data);
		var opt = urlutil.parse(url, false, true);
		opt.method = "POST";
		opt.headers = {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(postData)
		};
		// debug("POST", opt, data);
		var req = reqx.request(opt, (res) => {
			let rawData = "";
			res.setEncoding("utf8");
			res.on("data", (chunk) => rawData += chunk);
			res.on("end", () => {
				if (res.statusCode === 200) {
					let parsedData = JSON.parse(rawData);
					if (parsedData.errno) {
						reject(new Error(parsedData.errmsg));
					} else {
						resolve(parsedData);
					}
				} else {
					reject(new Error(rawData));
				}

			});
		});

		req.on("error", (e) => {
			reject(e);
		});

		// 写入数据到请求主体
		req.write(postData);
		req.end();
	});
};

let put = function(url, query, data) {
	let queryArry = [];
	for (let key in query) {
		query[key] = typeof query[key] == "object" ? JSON.stringify(query[key]) : query[key];
		queryArry.push(key + "=" + encodeURIComponent(query[key]));
	}

	if (queryArry.length > 0)
		url += "?" + queryArry.join("&");

	return new Promise(function(resolve, reject) {
		let reqx = http;
		if (url.slice(0, 5) === "https") reqx = https;
		var postData = JSON.stringify(data);
		var opt = urlutil.parse(url, false, true);
		opt.method = "put";
		opt.headers = {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(postData)
		};
		// debug("POST", opt, data);
		var req = reqx.request(opt, (res) => {
			let rawData = "";
			res.setEncoding("utf8");
			res.on("data", (chunk) => rawData += chunk);
			res.on("end", () => {
				if (res.statusCode === 200) {
					let parsedData = JSON.parse(rawData);
					if (parsedData.errno) {
						reject(new Error(parsedData.errmsg));
					} else {
						resolve(parsedData);
					}
				} else {
					reject(new Error(rawData));
				}

			});
		});

		req.on("error", (e) => {
			reject(e);
		});

		// 写入数据到请求主体
		req.write(postData);
		req.end();
	});
};

module.exports = {
	get: get,
	post: post,
	put: put
};
