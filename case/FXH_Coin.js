import { Intelligence, Case } from "./";
import cheerio from "cheerio";
import request from "../lib/request";
import FXH_Coin_DESC from "./FXH_Coin_DESC";
import fs from "fs";
import _ from "lodash";
import Debug from "debug";

const debug = Debug("crawler:case:FXH_Coin")

class FXH_Coin extends Case {
	constructor(opts) {
		super("fxh_coin", opts);
	}
	async interrogate(culprit, intell) {
		// impl
		let $ = cheerio.load(culprit);
		let maket = $("#baseInfo .cell.maket");
		let secondPark = $("#baseInfo .secondPark ul li");
		let evidence = {
			zh_name: $("h1", maket).text().split("\n")[4],
			en_name: $($(".value", secondPark)[0]).text().split("/")[0],
			symbol: $($(".value", secondPark)[0]).text().split("/")[1],
			logo_url: "https:" + $("img", "h1", maket).attr("src"),
			icon_url: "https:" + $("head > link").filter((i, el) => $(el).attr("rel") === "icon").attr("href"),
			desc: intell.path.replace("currencies", "coindetails"),
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
	async criminate(evidence, intell) {
		// impl
		// create
		let dataurl = "https://api.coinmarketcap.com/v1/ticker";
		let url = dataurl + intell.path.split("/currencies").pop();
		debug("request: " + url)
		let data = await request.get(url);
		if (!data[0]) return;
		data = data[0];
		evidence = _.assign(evidence, {
			cmc_id: data.id,
			en_name: data.name,
			symbol: data.symbol,
			total_amount: data.max_supply,
			attach: {
				total_market_cap_usd: data.market_cap_usd,
				amount: data.total_supply,
				price_usd: data.price_usd,
				min_price_usd: 0,
				max_price_usd: data.price_usd,

				// statistic
				min_price_usd_statistic: {},
				max_price_usd_statistic: {},
				price_usd_statistic: {
					of24h: data.price_usd
				},
				volume_usd_statistic: {
					of24h: data["24h_volume_usd"]
				},
				percent_change_statistic: {
					of24h: data["percent_change_24h"],
					of7d: data["percent_change_7d"]
				}
			}
		})

		// update

		await request.put("http://127.0.0.1:3000/rest/coin/" + evidence.symbol, null, evidence);
		return evidence;


	}

}

export default FXH_Coin
