import { Intelligence, Case } from "./";
import cheerio from "cheerio";

class FXH_Coin_Detail extends Case {
	constructor(opts) {
		super("fxh_coinn_desc", opts);
	}

	async interrogate(culprit) {

		// impl
		let evidence = "";
		let $ = cheerio.load(culprit);
		evidence = $(".artBox").text();
		return evidence;
	}
	async criminate(evidence) {

		// impl
		return evidence;
	}

}

export default FXH_Coin_Detail;
