import { Intelligence, Case } from "./";
import * as cheerio from "cheerio";
import * as Debug from "debug";
import request from "axios";
import x from "../lib/common/x";


const debug = Debug("crawler:case:AICoins");

class AICoins extends Case {
	constructor(opts) {
		super("fxh_coins", opts);
	}
	async interrogate(culprit: any, intell: Intelligence) {
		// impl
		return culprit.data;
	}
	async criminate(evidence) {
		// impl
		await x.eachSync(evidence, async(evd)=> {
			const url = this.targetDomain +  "/rest/coin/" + evd.short_name;
			debug("evidence:", url, {
				logo: evd.logo.split("?")[0]
			});
			await request.put(url, {
				logo_url: evd.logo.split("?")[0]
			});
		});
		
		return evidence;
	}
}

export default AICoins
