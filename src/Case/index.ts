import * as url from "url";
import x from "../lib/common/x";
import util from "../lib/common/util";
import request from "axios";


import Debug = require("debug");
import puppeteer = require("puppeteer");

const debug = Debug("crawler:case");

/**
 * 情报配置数据协议
 */
export interface IntelligenceOption {

	// 情报域名，默认使用 case 中的 domian 需要带协议号， 如：https://www.miwoes.com 
	domain ?: string;

	// 情报地址路径
	path ?: string;

	// 情报 url, 如果 url 存在可省略 path 
	url ?: string;

	// 其他辅助信息
	attach ?: {} 
}

/**
 * 情报
 */
export class Intelligence {
	domain: string; // 情报域名，默认使用 case 中的 domian 需要带协议号， 如：https://www.miwoes.com
	path: string; // 情报地址路径
	url: string; // 情报 url, 如果 url 存在可省略 path 
	attach: {}; // 其他辅助信息

	constructor(opts: IntelligenceOption) {

		// 必须存在 url 或 path 中的一个
		if (!opts || !(opts.url || opts.path)) throw new Error("params error:" + JSON.stringify(opts));

		this.domain = opts.domain;
		this.path = opts.path;
		this.url = opts.url;
		this.attach = opts.attach;
	}
}

/**
 * 拘留所
 * 搜集每个情报处理结
 */
export interface Slammer {
	[index: number]: any
}

/**
 * 警察，根据情报爬取
 */
class Police {
	case: Case;
	slammer: any[] = [];

	constructor(_case: Case) {
		this.case = _case;
	};

	/**
	 * 逮捕器，根据案子中的情报进行爬取
	 */
	async collar(): Promise<Slammer> {
		let queue: any[] = []; // 并且爬取队列
		while (this.case.intelligences.length > 0) {
			if (queue.length === 0)
				queue.push(this.case.intelligences.shift());
			if (queue.length >= this.case.slave || this.case.intelligences.length === 0) { 
				await x.each(queue, async(intell) => {
					/**
					 * TODO: Miwoes
					 * 缺少代理配置
					 */

					try {
						let culprit;
						if (this.case.headless) {
							debug("collar:launch:", intell.url);
							const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
							try {
								const page = await browser.newPage();
								page.setDefaultNavigationTimeout(this.case.timeout)
								await page.goto(intell.url);
								// await page.waitFor(3000)

								// let scrollEnable = true;
								// let scrollStep = 500; //每次滚动的步长
								// while (scrollEnable) {
								// 	scrollEnable = await page.evaluate((scrollStep) => {
								// 		let scrollTop = document.scrollingElement.scrollTop;
								// 		document.scrollingElement.scrollTop = scrollTop + scrollStep;
								// 		return document.body.clientHeight > scrollTop + 1080 ? true : false
								// 	}, scrollStep);
								// 	await util.sleep(100);
								// }

								culprit = await page.evaluate(() => {
									return document.documentElement.outerHTML;
								});
								await browser.close();
							} catch (err) {
								browser.close();
								throw err;
							}
						} else {
							debug("collar:request:", intell.url);
							
							// let client = request.create(intell.url, httpsAgent);
							culprit = await request.get(intell.url, {
								params: intell.query,
								headers: this.case.headers,
								timeout: this.case.timeout // 可配置
							});
							culprit = culprit.data;
						}

						let evidence = await this.case.interrogate(culprit, intell); // 审问
						let result = await this.case.criminate(evidence, intell); // 审判
						this.slammer.push(result);

					} catch (err) {
						if (this.case.force)
							this.case.onerror && await this.case.onerror(err, intell);
						else
							throw err;	
					}
					
				});
				queue = [];
				await util.sleep(this.case.sleepTime);
			}
		}

		this.onend && this.onend(this.slammer);
		return this.slammer;
	};
	onend(): void {
		
	};
	
}

/**
 * 案子配置数据协议
 */
export interface CaseOption { 
	domain: string; // 情报域名地址，需要带协议，如: https://www.miwoes.com
	headers?: object; // 请求头， {}
	sleepTime?: number; // 两次爬取间隔，代表两个 intelligence 爬取间隔，默认0s
	slave?: number; // 并行数量，并行爬取 intelligence 数量，默认1个
	force?: boolean; // 是否忽略错误强制执行，默认 false
	headless?: boolean; // 是否开启预渲染模式， 默认 false
	reportUrl?: string; // 报告地址，案子结束时的上报地址
	timeout?: number; // 超时时间，默认120000毫秒
}

/**
 * 案子
 */
export abstract class Case {

	// 案件名称
	name: string; 

	// 待爬取页面的，主域名
	domain: string;

	// 报告地址
	reportUrl: string;

	// 两次爬取间隔，代表两个 intelligence 爬取间隔，默认0s
	sleepTime: number;

	// 并行数量，并行爬取 intelligence 数量，默认1个
	slave: number;

	// 是否忽略错误强制执行，默认 false
	force: boolean;

	// 是否开启预渲染模式， 默认 false
	headless: boolean;

	// 情报
	intelligences: Intelligence[] = [];

	// 执行者
	police: Police;

	// 设置爬取器请求头
	headers: {};

	// 超时时间，默认120000毫秒
	timeout: number;

	/**
	 * 
	 * @param 案子名称
	 * @param 基础配置， 使用CaseOption接口中的配置 
	 */
	constructor(name = "case", opts: CaseOption) {
		this.name = name;
		this.domain = opts.domain;
		this.sleepTime = opts.sleepTime || 0;
		this.slave = opts.slave || 1;
		this.force = opts.force || false;
		this.headless = opts.headless || false;
		this.reportUrl = opts.reportUrl;
		this.police = new Police(this);
		this.headers = opts.headers;
		this.timeout = opts.timeout || 120000;
	};

	/**
	 * 情报收集器
	 * @param intelligence 情报数据协议
	 */
	gather(intelligence: Intelligence): Case {

		// 域名替换，对于特殊情报的域名地址并不和公有域名相同时，可单独为情报配置域名
		intelligence.domain = intelligence.domain || this.domain;

		// 合成情报地址，默认使用直接配置的情报url
		intelligence.url = intelligence.url || url.resolve(intelligence.domain, intelligence.path);

		this.intelligences.push(intelligence);

		return this;
	};

	/**
	 * 审问，数据清洗器
	 * 用于格式化html，抓取有用信息
	 * 便于审判时使用
	 * @param culprit 罪犯
	 * @param intell 情报
	 */
	async abstract interrogate(culprit: string, intell: Intelligence): Promise<any>;

	/**
	 * 审判，数据消费器
	 * @param evidence 证据，审问时格式化后的数据
	 * @param intell 情报
	 */
	async abstract criminate(evidence: any, intell: Intelligence): Promise<any>;

	/**
	 * 开始
	 */
	async start(): Promise<Slammer> {
		try {
			let result = await this.police.collar();
			return result;
		} catch (err) {
			this.onerror(err);
			throw err;
		}

	}

	/**
	 * 异常事件
	 * @param error 异常
	 */
	onerror(error: ErrorConstructor): void {
		debug("Error", error)
	}

	/**
	 * 全部结束事件
	 */
	onend(slammer: Slammer) {
		debug("The end.", slammer)
	}
}

