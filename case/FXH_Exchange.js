import { Intelligence, Case } from "./";
import cheerio from "cheerio";
import request from "../lib/request";

class FXH_Exchange extends Case {
	constructor(opts) {
		opts = opts || {};
		super("fxh_exchange", opts);
	}
	async interrogate(culprit, intell) {
		// impl
		let $ = cheerio.load(culprit);
		let evidence = {
			logo_url: "http:" + $(".marketinfo .cover img").attr("src"),
			zh_name: $(".marketinfo .info h1").text(),
			en_name: intell.path.split("/").pop(),
			introduce: $(".marketinfo .info .text").text(),
			support_type: $(".marketinfo .info .tag a").map((i, el) => $(el).attr("href").slice(-1)).get(),
			official_website: $("a", $(".marketinfo .info .web span")[0]).attr("href"),
			country: $("a", $(".marketinfo .info .web span")[1]).text(),
			cost_desc: $("body > div.w1200 > div > div.box.box845 > div.boxContain > div:nth-child(3) > section > p:nth-child(2)").html(),
			twitter: $(".twitter", $(".marketinfo .info .web span")[2]).attr("href"),
			facebook: $(".facebook", $(".marketinfo .info .web span")[2]).attr("href"),
			weibo: $(".blog", $(".marketinfo .info .web span")[2]).attr("href")
		};

		return evidence;
	}
	async criminate(evidence) {
		// impl
		request.put("http://127.0.0.1:3000/rest/exchange/" + evidence.en_name, null, evidence);
		return "evidence";
	}

}

export default FXH_Exchange;
