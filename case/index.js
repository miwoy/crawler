import request from "../lib/request";
import url from "url";
import { util, x } from "../lib/common";
import Debug from "debug";

const debug = Debug("crawler:case");

/**
 * 情报
 */
class Intelligence {
	constructor(opts) {
		if (!opts || !(opts.url || opts.path)) throw new Error("params error:" + JSON.stringify(opts));
		this.domain = opts.domain;
		this.path = opts.path;
		this.url = opts.url;
	}
}

/**
 * 爬取器
 */
class Police {
	constructor(_case) {
		this.case = _case;
		this.slammer = [];
	}
	async collar() { // 逮捕
		let intell;
		while (this.case.intelligences.length > 0) {
			intell = this.case.intelligences.shift();
			debug("collar:", intell.url);
			try {
				let culprit = await request.get(intell.url, intell.query, {
					ContentType: "HTML"
				});
				await util.sleep(this.case.sleepTime || 0);
				let evidence = await this.case.interrogate(culprit); // 审问
				debug("interrogate:", evidence);
				let result = await this.case.criminate(evidence); // 审判
				debug("criminate:", result);
				this.slammer.push(result);
			} catch (err) {
				if (!this.case.force) throw err;
				this.case.onerror && this.case.onerror(err);
			}

		}

		this.onend && this.onend();
		return this.slammer;
	}
}

/**
 * 案子
 */
class Case {
	constructor(name, opts) {
		opts = opts || {};
		this.name = name || "case";
		this.domain = opts.domain;
		this.sleepTime = opts.sleepTime || 1000;
		this.force = opts.force || false;
		this.intelligences = [];
		this.police = new Police(this);
	}
	gather(intelligence) {
		if (!(intelligence instanceof Intelligence)) throw new TypeError("intelligence: "+ JSON.stringify(intelligence));

		intelligence.domain = intelligence.domain || this.domain;
		intelligence.url = intelligence.url || url.resolve(intelligence.domain, intelligence.path);
		this.intelligences.push(intelligence);
	}
	async interrogate() { // 审问
		throw new Error("必须实现该接口 interrogate");
	}
	async criminate() { // 审判
		throw new Error("必须实现该接口 criminate");
	}
	async start() { // 启动
		try {
			let result = await this.police.collar();
			return result;
		} catch (err) {
			this.onerror(err);
			throw err;
		}

	}
	async onerror(error) {

	}
	async onend() {

	}
}

export default { Intelligence, Case }
