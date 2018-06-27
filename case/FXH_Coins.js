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
			let path = $("a", table[i].children[1]).attr("href");
			let mining_type = 0;
			mining_type = ($(table[i].children[4]).html()).split(";")[1];
			switch(mining_type) {
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

export default FXH_Coins
