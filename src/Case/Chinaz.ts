import { Intelligence, Case } from "./";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as _ from "lodash";
import * as Debug from "debug";

const debug = Debug("crawler:case:Chinaz")

class Chinaz extends Case {
	constructor(opts: { domain: string, sleepTime?: 0, fork?: 1, force?: true}) {
		super("chinaz", opts);
	}
	async interrogate(culprit, intell): Promise<any> {
		// impl
		let $ = cheerio.load(culprit);
		let evidence = [];
		// console.log("debug1interrogate", culprit, intell);

		return evidence;

	}
	async criminate(evidence, intell): Promise<any> {
		// console.log("debug1criminate", evidence, intell);
		// update
		// ["中文名", "英文名", "代码", "logo", "官网", "发布时间", "类型", "总数量", "已发行数量", "当前价格"]
		
		// await request.put("http://127.0.0.1:3000/rest/coin/" + evidence.symbol, null, evidence);
		return evidence;


	}

}

export default Chinaz
