import request from "../lib/request";
import url from "url";
import { util, x } from "../lib/common";
import Debug from "debug";
import puppeteer from "puppeteer";

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
		this.attach = opts.attach;
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
		let queue = [];
		let self = this;
		while (self.case.intelligences.length > 0) {
			queue.push(self.case.intelligences.shift());
			if (queue.length >= self.case.fork) {
				await x.each(queue, async(intell) => {
					debug("collar:", intell.url);
					const browser = await puppeteer.launch();
					try {

						// let culprit = await request.get(intell.url, intell.query, {
						// 	ContentType: "HTML"
						// });


						const page = await browser.newPage();
						await page.goto(intell.url);
						let culprit = await page.evaluate(() => {
							return document.documentElement.outerHTML;
						});
						await browser.close();
						let evidence = await self.case.interrogate(culprit, intell); // 审问
						// debug("interrogate:", evidence);
						let result = await self.case.criminate(evidence, intell); // 审判
						// debug("criminate:", result);
						self.slammer.push(result);
					} catch (err) {
						browser.close();
						if (!self.case.force) throw err;
						self.case.onerror && self.case.onerror(err);
					}
				});
				queue = [];
				await util.sleep(self.case.sleepTime || 0);
			}
		}

		self.onend && self.onend();
		return self.slammer;
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
		this.sleepTime = opts.sleepTime || 0;
		this.fork = opts.fork || 1;
		this.force = opts.force || true;
		this.intelligences = [];
		this.police = new Police(this);
	}
	gather(intelligence) {
		if (!(intelligence instanceof Intelligence)) throw new TypeError("intelligence: " + JSON.stringify(intelligence));

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
		console.log("Error", error)
	}
	async onend() {

	}
}

export default { Intelligence, Case }
