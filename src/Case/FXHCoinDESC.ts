import { Intelligence, Case } from "./";
import * as cheerio from "cheerio";
import * as Debug from "debug";

const debug = Debug("crawler:case:FXHCoinDESC");


class FXHCoinDetail extends Case {
	constructor(opts) {
		super("fxh_coinn_desc", opts);
	}

	async interrogate(culprit) {

		// impl
		let evidence: string = "";
		let $ = cheerio.load(culprit);
		evidence = $(".artBox").text();
		return evidence;
	}
	async criminate(evidence: string) {
		// impl
		return evidence;
	}

}

export default FXHCoinDetail;
