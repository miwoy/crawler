import { Intelligence, Case } from "./";
import cheerio from "cheerio";
import request from "../lib/request";
import fs from "fs";
import _ from "lodash";
import Debug from "debug";

const debug = Debug("crawler:case:ZhihuPeople")

class ZhihuPeople extends Case {
	constructor(opts) {
		super("zhihuPeople", opts);
	}
	async interrogate(culprit, intell) {

		// impl
		let $ = cheerio.load(culprit);
		let divs = $(".List-item");

		let evidence = [];
		for (let i = 0; i < divs.length; i++) {
			let avatar = $(".UserLink-avatar", divs[i]).attr("src");
			let username = $(".UserLink-link", divs[i]).text();
			if (!avatar || avatar === 'https://pic4.zhimg.com/da8e974dc_im.jpg') {
				continue;
			}
			evidence.push({
				avatar,
				username
			});
		}

		return evidence;

	}
	async criminate(evidence, intell) {
		return evidence;
	}

}

export default ZhihuPeople
