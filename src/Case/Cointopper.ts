import { Intelligence, Case } from "./";
import * as cheerio from "cheerio";
import * as Debug from "debug";
import request from "axios";

const debug = Debug("crawler:case:Cointopper");

class Cointopper extends Case {
	constructor(opts) {
		super("cointopper", opts);
	}
	async interrogate(culprit: string, intell: Intelligence) {
		// impl
		let $ = cheerio.load(culprit);
		let table = $("#MyTable > tbody > tr");
		let evidence: any[]  = [];
		for (let i = 0; i < table.length; i++) {
			let url = $("img", table[i].children[3]).attr("src");
			evidence.push({
				logo_url: url.replace("/thumb", "/coins"),
				symbol: url.split("-").pop().split(".").shift().toUpperCase()
			});
		}

		return evidence;
	}
	async criminate(evidence) {
		// impl
		return evidence;
	}
}

export default Cointopper
