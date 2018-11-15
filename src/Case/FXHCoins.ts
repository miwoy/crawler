import { Intelligence, Case } from "./";
import FXHCoin from "./FXHCoin";
import * as cheerio from "cheerio";
import * as Debug from "debug";
import request from "axios";

const debug = Debug("crawler:case:FXHCoins");

class FXHCoins extends Case {
	constructor(opts) {
		super("fxh_coins", opts);
	}
	async interrogate(culprit: string, intell: Intelligence) {
		// impl
		let $ = cheerio.load(culprit);
		let table = $("#table tbody tr");
		let evidence: any[]  = [];
		let fxh_coin = new FXHCoin({ 
			domain: this.domain, 
			headless: true,
			force: true,
			slave: 4,
			targetDomain: this.targetDomain
		});
		for (let i = 0; i < table.length; i++) {
			let path = $("a", table[i].children[1]).attr("href");
			let symbol = $("a", table[i].children[1]).text().split("-")[0] || "";
			let exists = await request.get(this.targetDomain + "/rest/coin/" + symbol.trim());
			if (exists.data.data) continue;
			let mining_type = 0;
			let mining_type_str = ($(table[i].children[4]).html()).split(";")[1];
			switch(mining_type_str) {
				case "*":
					mining_type = 2;
					break;
				case "**":
					mining_type = 3;
					break;
				case '<i class="ifo"><div></div></i>':
					mining_type = 4;
					break
				default:
					mining_type = 1;
					break
			}

			fxh_coin.gather(new Intelligence({
				path: path,
				attach: {
					mining_type: mining_type
				}
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

export default FXHCoins
