import { Intelligence, Case } from "./";
import cheerio from "cheerio";

class Binance extends Case {
	constructor(opts) {
		super("binance", opts);
	}

	async interrogate(culprit) {

		// impl
		let evidence = "";
		let $ = cheerio.load(culprit);
		evidence = $("body > div:nth-child(2) > div:nth-child(3) > div > div.row.content-top > div.col-xs-7 > div > div:nth-child(4) > div > strong:nth-child(3) > font").text();
		console.log(evidence)
		return evidence;
	}
	async criminate(evidence) {

		// impl
		return evidence;
	}

}

export default Binance;
