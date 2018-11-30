import { Intelligence, Case, Slammer } from "./";
import * as cheerio from "cheerio";
import request from "axios";
import * as fs from "fs";
import * as _ from "lodash";
import * as Debug from "debug";
import FXHCoinDESC from "./FXHCoinDESC";

const debug = Debug("crawler:case:FXHCoin");

interface Evidence {
	zh_name: string;
	en_name: string;
	symbol: string;
	logo_url: string;
	icon_url: string;
	desc: string;
	website: string[];
	blockexplorer: string[];
	publish_time: string;
	book_url: string;
	type: number;
	total_amount: number;
	mining_type: string;
	attach: Attach;
}

interface Attach {
	total_market_cap_usd: number;
	amount: number;
	price_usd: number;
	min_price_usd: number;
	max_price_usd: number;
	volume_usd_24h: number;
	max_price_usd_24h: number;
	min_price_usd_24h: number;
	[propName: string]: any;
}

class FXHCoin extends Case {
	constructor(opts) {
		super("fxh_coin", opts);
	}
	async interrogate(culprit, intell) {

		// impl
		let $ = cheerio.load(culprit);
		let maket = $("#baseInfo .cell.maket");
		let secondPark = $("#baseInfo .secondPark ul li");
		let evidence: Evidence = {
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
			type: $(".value", $(secondPark[7])).text().replace("\n", "").trim() === "是" ? 2 : 1,
			total_amount: parseFloat($("#baseInfo > div.firstPart > div:nth-child(3) > div:nth-child(4)").text().replace(/,/g, "")),
			mining_type: intell.attach.mining_type,
			attach: {
				total_market_cap_usd: parseFloat(($("#baseInfo > div.firstPart > div:nth-child(2) > div:nth-child(3)").text().split("$")[1] || "").replace(/,/g, "")),
				amount: parseFloat($("#baseInfo > div.firstPart > div:nth-child(3) > div:nth-child(2)").text().replace(/,/g, "")),
				price_usd: parseFloat(($("#baseInfo > div.firstPart > div.cell.maket > div.sub > span:nth-child(1)").text().split("$")[1] || "").replace(/,/g, "")),
				min_price_usd: parseFloat(($("#baseInfo > div.firstPart > div.cell.maket > div.sub > span:nth-child(1)").text().split("$")[1] || "").replace(/,/g, "")),
				max_price_usd: parseFloat(($("#baseInfo > div.firstPart > div.cell.maket > div.sub > span:nth-child(1)").text().split("$")[1] || "").replace(/,/g, "")),
				min_price_usd_24h: parseFloat(($("#baseInfo > div.firstPart > div.cell.maket > div.sub > span:nth-child(1)").text().split("$")[1] || "").replace(/,/g, "")),
				max_price_usd_24h: parseFloat(($("#baseInfo > div.firstPart > div.cell.maket > div.sub > span:nth-child(1)").text().split("$")[1] || "").replace(/,/g, "")),
				volume_usd_24h: parseFloat(($("#baseInfo > div.firstPart > div:nth-child(4) > div:nth-child(3)").text().split("$")[1] || "").replace(/,/g, ""))
			}

		};

		let fxhCoinDesc: FXHCoinDESC = new FXHCoinDESC({ domain: this.domain, headless: true });

		fxhCoinDesc.gather(new Intelligence({
			path: evidence.desc
		}));

		try {
			let fxhCoinDescSlammer: Slammer = await fxhCoinDesc.start();
			evidence.desc = fxhCoinDescSlammer[0];
		} catch (e) {
			evidence.desc = ""
		}

		return evidence;

	}
	async criminate(evidence: Evidence, intell: Intelligence) {
		// impl
		const url = this.reportUrl +  "/rest/coin/" + evidence.symbol;
		evidence.attach.ico_end_time = intell.attach["attach.ico_end_time"];
		evidence.attach.sale_price_usd = intell.attach["attach.sale_price_usd"];
		evidence.attach.telegram = intell.attach["attach.telegram"];
		evidence.attach.hype = intell.attach["attach.hype"];
		evidence.attach.rating = intell.attach["attach.rating"];
		evidence.attach.usd_raised = intell.attach["attach.usd_raised"];
		debug("evidence:", url);
		await request.put(url, evidence);
		return evidence;
	}

}

export default FXHCoin;
