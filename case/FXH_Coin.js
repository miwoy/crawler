import { Intelligence, Case } from "./";
import cheerio from "cheerio";
import request from "../lib/request";
import FXH_Coin_DESC from "./FXH_Coin_DESC";
import Binance from "./binance";
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
			type: $(".value", $(secondPark[7])).text().replace("\n", "").trim() === "是" ? 2 : 1,
			total_amount: parseFloat($("#baseInfo > div.firstPart > div:nth-child(3) > div:nth-child(4)").text().replace(/,/g, "")),
			attach: {
				total_market_cap_usd: parseFloat(($("#baseInfo > div.firstPart > div:nth-child(2) > div:nth-child(3)").text().split("$")[1] || "").replace(/,/g, "")),
				amount: parseFloat($("#baseInfo > div.firstPart > div:nth-child(3) > div:nth-child(2)").text().replace(/,/g, "")),
				price_usd: parseFloat(($("#baseInfo > div.firstPart > div.cell.maket > div.sub > span:nth-child(1)").text().split("$")[1] || "").replace(/,/g, "")),
				min_price_usd: parseFloat(($("#baseInfo > div.firstPart > div.cell.maket > div.sub > span:nth-child(1)").text().split("$")[1] || "").replace(/,/g, "")),
				max_price_usd: parseFloat(($("#baseInfo > div.firstPart > div.cell.maket > div.sub > span:nth-child(1)").text().split("$")[1] || "").replace(/,/g, "")),

				// statistic
				min_price_usd_statistic: {
					of24h: parseFloat(($("#baseInfo > div.firstPart > div.cell.maket > div.sub > span:nth-child(1)").text().split("$")[1] || "").replace(/,/g, "")),
					of7d: parseFloat(($("#baseInfo > div.firstPart > div.cell.maket > div.sub > span:nth-child(1)").text().split("$")[1] || "").replace(/,/g, "")),
					of30d: parseFloat(($("#baseInfo > div.firstPart > div.cell.maket > div.sub > span:nth-child(1)").text().split("$")[1] || "").replace(/,/g, ""))
				},
				max_price_usd_statistic: {
					of24h: parseFloat(($("#baseInfo > div.firstPart > div.cell.maket > div.sub > span:nth-child(1)").text().split("$")[1] || "").replace(/,/g, "")),
					of7d: parseFloat(($("#baseInfo > div.firstPart > div.cell.maket > div.sub > span:nth-child(1)").text().split("$")[1] || "").replace(/,/g, "")),
					of30d: parseFloat(($("#baseInfo > div.firstPart > div.cell.maket > div.sub > span:nth-child(1)").text().split("$")[1] || "").replace(/,/g, ""))
				},
				volume_usd_statistic: {
					of24h: parseFloat(($("#baseInfo > div.firstPart > div:nth-child(4) > div:nth-child(3)").text().split("$")[1] || "").replace(/,/g, "")),
					of7d: 0,
					of30d: 0
				},
				open_price_usd_statistic: {
					of24h: parseFloat(($("#baseInfo > div.firstPart > div.cell.maket > div.sub > span:nth-child(1)").text().split("$")[1] || "").replace(/,/g, "")),
					of7d: parseFloat(($("#baseInfo > div.firstPart > div.cell.maket > div.sub > span:nth-child(1)").text().split("$")[1] || "").replace(/,/g, "")),
					of30d: parseFloat(($("#baseInfo > div.firstPart > div.cell.maket > div.sub > span:nth-child(1)").text().split("$")[1] || "").replace(/,/g, ""))
				}
			}

		};

		let fxh_coin_desc = new FXH_Coin_DESC({ domain: this.domain });

		fxh_coin_desc.gather(new Intelligence({
			path: evidence.desc
		}));

		try {
			evidence.desc = await fxh_coin_desc.start();
		} catch (e) {
			evidence.desc = ""
		}


		return evidence;

	}
	async criminate(evidence, intell) {
		// impl
		// create
		// let dataurl = "https://api.coinmarketcap.com/v1/ticker";
		// let url = dataurl + intell.path.split("/currencies").pop();
		// debug("request: " + url)
		// let data = await request.get(url);
		// if (!data[0]) return;
		// data = data[0];
		// evidence = _.assign(evidence, {
		// 	cmc_id: data.id,
		// 	en_name: data.name,
		// 	symbol: data.symbol,
		// 	total_amount: data.max_supply,
		// 	attach: {
		// 		total_market_cap_usd: data.market_cap_usd,
		// 		amount: data.total_supply,
		// 		price_usd: data.price_usd,
		// 		min_price_usd: data.price_usd,
		// 		max_price_usd: data.price_usd,

		// 		// statistic
		// 		min_price_usd_statistic: {},
		// 		max_price_usd_statistic: {},
		// 		price_usd_statistic: {
		// 			of24h: data.price_usd
		// 		},
		// 		volume_usd_statistic: {
		// 			of24h: data["24h_volume_usd"]
		// 		},
		// 		percent_change_statistic: {
		// 			of24h: data["percent_change_24h"],
		// 			of7d: data["percent_change_7d"]
		// 		}
		// 	}
		// })

		// update
		// ["中文名", "英文名", "代码", "logo", "官网", "发布时间", "类型", "总数量", "已发行数量", "当前价格", "发行价"]
		if (new Date(evidence.publish_time).getTime() >= 1514764800000) {
			try {
				let binance = new Binance({ domain: "https://info.binance.com/cn/F" });
				binance.gather(new Intelligence({
					path: evidence.en_name.split(" ")[0]
				}));

				evidence.issue_price_usd = await binance.start();
			} catch (e) {
				console.log(e)
				evidence.issue_price_usd = 0;
			}
			fs.appendFileSync('coins.csv', [
				evidence.zh_name.trim(), evidence.en_name.trim(),
				evidence.symbol, evidence.logo_url, evidence.website,
				evidence.publish_time, evidence.type,
				evidence.total_amount, evidence.attach.amount,
				evidence.attach.price_usd,
				evidence.issue_price_usd
			].join(",") + "\n");
		}

		// await request.put("http://127.0.0.1:3000/rest/coin/" + evidence.symbol, null, evidence);
		return evidence;


	}

}

export default FXH_Coin
