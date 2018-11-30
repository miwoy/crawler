let http = require("http");
let https = require("https");
let urlutil = require("url");
let Debug = require("debug");
let SocksProxyAgent = require('socks-proxy-agent');

const debug = Debug("cobweb:service:request");
const proxyOptions = 'socks5://127.0.0.1:1080';
// create the socksAgent for axios
const httpsAgent = new SocksProxyAgent(proxyOptions);
let get = function(url, query) {
	let queryArry = [];
	for (let key in query) {
		query[key] = typeof query[key] == "object" ? JSON.stringify(query[key]) : query[key];
		queryArry.push(key + "=" + encodeURIComponent(query[key]));
	}

	if (queryArry.length > 0)
		url += "?" + queryArry.join("&");
	debug("GET " + url);
	return new Promise(function(resolve, reject) {
		let opts = urlutil.parse(url);
		opts.agent = httpsAgent;
		let httpx = http;
		console.log(opts)
		if (opts.protocol === "https:") {
			httpx = https;
		}
		httpx.get(opts, (res) => {
			const statusCode = res.statusCode;
			const contentType = res.headers["content-type"];
			let error;
			if (statusCode !== 200) {
				error = new Error("请求失败。\n" +
					`状态码: ${statusCode}`);
			} else if (!/^application\/json/.test(contentType)) {
				error = new Error("无效的 content-type.\n" +
					`期望 application/json 但获取的是 ${contentType}`);
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
					let parsedData = JSON.parse(rawData);
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
		var postData = JSON.stringify(data);
		var opt = urlutil.parse(url, false, true);
		opt.method = "POST";
		opt.headers = {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(postData)
		};
		debug("POST", opt, data);
		var req = http.request(opt, (res) => {
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
	post: post
};
