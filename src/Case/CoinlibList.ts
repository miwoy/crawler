import { Intelligence, Case } from "./";
import Coinlib from "./Coinlib";
import * as cheerio from "cheerio";
import * as Debug from "debug";
import request from "axios";

const debug = Debug("crawler:case:CoinlibList");

class CoinlibList extends Case {
	constructor(opts) {
		super("coinlibList", opts);
	}
	async interrogate(culprit: string, intell: Intelligence) {
		// impl
		let $ = cheerio.load(culprit);
		let table = $("body > section.mt-sm-4 > div > table > tbody tr");
		let evidence: any[]  = [];
		let coinlib = new Coinlib({ 
			domain: this.domain, 
			headless: true,
			force: true,
			slave: 10,
			targetDomain: this.targetDomain
		});
		for (let i = 0; i < table.length; i++) {
			let path = $("a", table[i].children[4]).attr("href");
			let symbol = $("div.tbl-currency > span", table[i].children[4]).text();
			coinlib.gather(new Intelligence({
				path: path
			}));

			evidence.push(path);
		}


		let coins = await coinlib.start();

		return coins;
	}
	async criminate(evidence) {
		// impl
		return evidence;
	}
}

export default CoinlibList
