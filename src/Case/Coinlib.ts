import { Intelligence, Case, Slammer } from "./";
import * as cheerio from "cheerio";
import request from "axios";
import * as fs from "fs";
import * as _ from "lodash";
import * as Debug from "debug";

const debug = Debug("crawler:case:Coinlib");

interface Evidence {
	en_name: string;
	symbol: string;
	en_desc: string;
}

interface Attach {
	total_market_cap_usd: number;
	amount: number;
	price_usd: number;
	min_price_usd: number;
	max_price_usd: number;
	volume_usd_24h: number;
	max_price_usd_24h: number;
	min_price_usd_24h: number;
	[propName: string]: any;
}

class Coinlib extends Case {
	constructor(opts) {
		super("coinlib", opts);
	}
	async interrogate(culprit, intell) {

		// impl
		let $ = cheerio.load(culprit);
		let en_name: string = $("body > div.sub-header.with-alt-prices > div > div > div.col-xl-5.col-lg-12.row.pr-0 > div.col-12.col-md-7.col-lg-12 > div.sub-coin-title > h1").text();
		let evidence: Evidence = {
			// zh_name: $("h1", maket).text().split("\n")[4],
			en_name: en_name,
			symbol: $("body > div.sub-header.with-alt-prices > div > div > div.col-xl-5.col-lg-12.row.pr-0 > div.col-12.col-md-7.col-lg-12 > div.sub-coin-title > span").text(),
			// logo_url: "https:" + $("img", "h1", maket).attr("src"),
			// icon_url: "https:" + $("head > link").filter((i, el) => $(el).attr("rel") === "icon").attr("href"),
			// desc: intell.path.replace("currencies", "coindetails"),
			en_desc: $("body > section.graph-wrapper > div > div.col-xl-12 > div > div.coin-description.col-12").text().replace("Show more [+]", "").replace(`What is ${en_name}?`, "")
		};

		console.log(evidence)
		return evidence;

	}
	async criminate(evidence: Evidence, intell: Intelligence) {
		// impl
		const url = this.targetDomain +  "/rest/coin/" + evidence.symbol;
		debug("evidence:", url);
		await request.put(url, evidence);
		return evidence;
	}

}

export default Coinlib;
