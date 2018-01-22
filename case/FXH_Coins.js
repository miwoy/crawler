import { Intelligence, Case } from "./";
import FXH_Coin from "./FXH_Coin";
import cheerio from "cheerio";

class FXH_Coins extends Case {
	constructor(opts) {
		super("fxh_coins", opts);
	}
	async interrogate(culprit) {
		// impl
		let $ = cheerio.load(culprit);
		let table = $("#table tbody tr");
		let evidence = [];
		let fxh_coin = new FXH_Coin({ domain: this.domain });
		for (let i = 0; i < table.length; i++) {
			let path = $("a", table[i].children[3]).attr("href");

			fxh_coin.gather(new Intelligence({
				path: path
			}));
			evidence.push(path);
		}


		let coins = await fxh_coin.start();

		return coins;
	}
	async criminate(evidence) {
		// impl
		return evidence;
	}

}

export default FXH_Coins
