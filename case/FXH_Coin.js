import { Intelligence, Case } from "./";
import cheerio from "cheerio";
import request from "../lib/request";
import FXH_Coin_DESC from "./FXH_Coin_DESC";

class FXH_Coin extends Case {
	constructor(opts) {
		super("fxh_coin", opts);
	}
	async interrogate(culprit) {
		// impl
		let $ = cheerio.load(culprit);
		let maket = $("#baseInfo .cell.maket");
		let secondPark = $("#baseInfo .secondPark ul li");
		let evidence = {
			zh_name: $("h1", maket).text().split("\n")[4],
			en_name: $($(".value", secondPark)[0]).text().split("/")[0],
			symbol: $($(".value", secondPark)[0]).text().split("/")[1],
			icon_url: "https:" + $("img", "h1", maket).attr("src"),
			desc: $(".des a", maket).attr("href"),
			website: $($(".value a", secondPark[5])).map((i, el) => $(el).attr("href")).get(),
			blockexplorer: $(".value a", $(secondPark[6])).map((i, el) => $(el).attr("href")).get(),
			publish_time: $(".value", secondPark[3]).text(),
			book_url: $($(".value a", secondPark[4])).attr("href"),
			type: $(".value", $(secondPark[7])).text().replace("\n", "").trim() === "是" ? 2 : 1

		};

		let fxh_coin_desc = new FXH_Coin_DESC({ domain: this.domain });

		fxh_coin_desc.gather(new Intelligence({
			path: evidence.desc
		}));

		evidence.desc = await fxh_coin_desc.start();

		return evidence;

	}
	async criminate(evidence) {
		// impl
		request.put("http://127.0.0.1:3000/rest/coin/" + evidence.symbol,null, evidence);
		return evidence;
	}

}

export default FXH_Coin
