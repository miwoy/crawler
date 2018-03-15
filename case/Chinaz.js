import { Intelligence, Case } from "./";
import cheerio from "cheerio";
import request from "../lib/request";
import FXH_Coin_DESC from "./FXH_Coin_DESC";
import fs from "fs";
import _ from "lodash";
import Debug from "debug";

const debug = Debug("crawler:case:FXH_Coin")

class Chinaz extends Case {
	constructor(opts) {
		super("chinaz", opts);
	}
	async interrogate(culprit, intell) {
		// impl
		let $ = cheerio.load(culprit);
		let evidence = ["日期", "百度权重", "预估流量", "关键词数", "站长排名", "世界排名", "流量排名", "日均IP", "日均PV"];


		return evidence;

	}
	async criminate(evidence, intell) {

		// update
		// ["中文名", "英文名", "代码", "logo", "官网", "发布时间", "类型", "总数量", "已发行数量", "当前价格"]
		
		// await request.put("http://127.0.0.1:3000/rest/coin/" + evidence.symbol, null, evidence);
		return evidence;


	}

}

export default Chinaz
