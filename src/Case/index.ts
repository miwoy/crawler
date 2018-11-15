import * as url from "url";
import x from "../lib/common/x";
import util from "../lib/common/util";
import request from "axios";


import Debug = require("debug");
import puppeteer = require("puppeteer");

const debug = Debug("crawler:case");

/**
 * 情报
 */
export class Intelligence {
	domain: string;
	path: string;
	url: string;
	attach: {};

	constructor(opts: {domain?: string, path?: string, url?: string, attach?: {}}) {
		if (!opts || !(opts.url || opts.path)) throw new Error("params error:" + JSON.stringify(opts));
		this.domain = opts.domain;
		this.path = opts.path;
		this.url = opts.url;
		this.attach = opts.attach;
	}
}

/**
 * 拘留所
 */
export interface Slammer {
	[index: number]: any
}

/**
 * 警察
 */
class Police {
	case: Case;
	slammer: any[] = [];
	constructor(_case: Case) {
		this.case = _case;
	};
	async collar(): Promise<Slammer> { // 逮捕
		let intell;
		let queue: any[] = [];
		while (this.case.intelligences.length > 0) {
			queue.push(this.case.intelligences.shift());
			if (queue.length >= this.case.slave) {
				await x.each(queue, async(intell) => {
					debug("collar:", intell.url);
					try {
						let culprit;

						if (this.case.headless) {
							const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
							try {
								const page = await browser.newPage();
								page.setDefaultNavigationTimeout(120000)
								await page.goto(intell.url);
								culprit = await page.evaluate(() => {
									return document.documentElement.outerHTML;
								});
								await browser.close();
							} catch (err) {
								browser.close();
								throw err;
								
							}
						} else {
							culprit = await request.get(intell.url, {
								params: intell.query,
								headers: this.case.headers
							});
						}

						

						let evidence = await this.case.interrogate(culprit, intell); // 审问
						let result = await this.case.criminate(evidence, intell); // 审判
						this.slammer.push(result);
					} catch (err) {
						if (this.case.force)
							this.case.onerror && this.case.onerror(err);
						else
							throw err;	
					}
					
				});
				queue = [];
				await util.sleep(this.case.sleepTime);
			}
		}

		this.onend && this.onend();
		return this.slammer;
	};
	onend(): void {
		
	};
	
}

export interface CaseOption { 
	domain: string;
	headers?: object;
	sleepTime?:number; 
	slave?: number; 
	force?: boolean; 
	headless?: boolean;
	targetDomain? :string;
}

/**
 * 案子
 */
export abstract class Case {

	// 案件名称
	name: string; 

	// 主域名
	domain: string;

	// 目标域名
	targetDomain: string;

	// 两次爬取间隔
	sleepTime: number;

	// 并行数量
	slave: number;

	// 是否忽略错误强制执行
	force: boolean;

	// 是否开启预渲染模式
	headless: boolean;

	// 情报
	intelligences: Intelligence[] = [];

	// 执行者
	police: Police;

	headers: {}

	constructor(name = "case", opts: CaseOption) {
		this.name = name;
		this.domain = opts.domain;
		this.sleepTime = opts.sleepTime|| 0;
		this.slave = opts.slave || 1;
		this.force = opts.force || false;
		this.headless = opts.headless || false;
		this.targetDomain = opts.targetDomain;
		this.police = new Police(this);
		this.headers = opts.headers;
	};
	gather(intelligence: Intelligence): Case {
		intelligence.domain = intelligence.domain || this.domain;
		intelligence.url = intelligence.url || url.resolve(intelligence.domain, intelligence.path);
		this.intelligences.push(intelligence);
		return this;
	};
	async abstract interrogate(culprit: string, intell: Intelligence): Promise<any>;// 审问:数据清洗器，用于格式化html，抓取有用信息
	async abstract criminate(evidence: any, intell: Intelligence): Promise<any>; // 审判:将审问阶段格式化的数据有效利用的函数
	async start(): Promise<Slammer> { // 启动
		try {
			let result = await this.police.collar();
			return result;
		} catch (err) {
			this.onerror(err);
			throw err;
		}

	}
	onerror(error: ErrorConstructor): void {
		console.log("Error", error)
	}
	onend() {

	}
}

