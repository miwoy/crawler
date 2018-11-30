import { Intelligence, Case } from "./";
import ICOBenchDetail from "./ICOBenchDetail";
import * as cheerio from "cheerio";
import * as Debug from "debug";
import request from "axios";

const debug = Debug("crawler:case:ICOBench");

class ICOBench extends Case {
	constructor(opts) {
		super("ico_benchx", opts);
	}
	async interrogate(culprit: string, intell: Intelligence) {
		// impl
		let $ = cheerio.load(culprit);
		let table = $("#category > div > div.row > div.ico_list > table > tbody tr");
		let evidence: any[]  = [];
		

		let icoBenchDetail = new ICOBenchDetail({ 
			domain: this.domain, 
			// headless: true,
			force: true,
			slave: 4,
			reportUrl: this.reportUrl
		});
		for(let i=1; i<table.length;i++) {
			let tr = table[i];
			let path = $("td.ico_data > div.image_box > a", tr).attr("href")
			icoBenchDetail.gather(new Intelligence({
				path: path
			}));
			evidence.push(path)
		}

		let icoBenchDetails = await icoBenchDetail.start();
		return icoBenchDetails;
	}
	async criminate(evidence, intell: Intelligence) {
		// impl
		debug("over ", intell.url)
		return evidence;
	}
}

export default ICOBench
