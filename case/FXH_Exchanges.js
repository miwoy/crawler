import { Intelligence, Case } from "./";
import FXH_Exchange from "./FXH_Exchange";
import cheerio from "cheerio";

class FXH_Exchanges extends Case {
	constructor(opts) {
		opts = opts || {};
		super("fxh_exchanges", opts);
	}
	async interrogate(culprit) {
		// impl
		let $ = cheerio.load(culprit);
		let list = $(".plantList li");
		list = list.map((i, el) => {
			return $("a", el).attr("href");
		}).get();
		let fxh_exchange = new FXH_Exchange({
			domain: this.domain
		});

		list.forEach(path => {
			if (/.+exchange.+/.test(path))
			fxh_exchange.gather(new Intelligence({
				path: path
			}))
		});

		let evidence = await fxh_exchange.start();

		return list;
	}
	async criminate(evidence) {
		// impl
		return evidence
	}

}


export default FXH_Exchanges;
