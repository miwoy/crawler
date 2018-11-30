import { Intelligence, Case, Slammer } from "./";
import * as cheerio from "cheerio";
import request from "axios";
import * as fs from "fs";
import * as _ from "lodash";
import * as Debug from "debug";

const debug = Debug("crawler:case:ICOBenchDetail");

interface ICO {
	
	logo: string;
	location: string;
	website: string;
	alias: string;
	profile: Profile;
	social: Social;
	project: ProjectDetail;
}

interface Profile {
	name: string;
	bio: string;
	description: string;
}

interface Social {
	twitter?: string;
    facebook?: string;
    medium?: string;
    blog?: string;
    linkedin?: string;
    telegram?: string;
    youtube?: string;
    instagram?: string;
    reddit?: string;
    slack?: string;
    gitter?: string;
    wiki?: string;
    bitcointalk?: string;
    google_plus?: string;
    kakao?: string;
    discord?: string;
    dribbble?: string;
    weibo?: string;
}

interface ProjectDetail {
	license?: string;
    status?: string;
    ico_status?: string;
    whitepaper?: string;
    email?: string;
    platform?: string;
    etherian?: string;
}


class ICOBenchDetail extends Case {
	constructor(opts) {
		super("icoBenchDetail", opts);
	}
	async interrogate(culprit, intell) {

		// impl
		let $ = cheerio.load(culprit);
		let data_row = $("#profile_header > div > div.fixed_data > div.financial_data > div.data_row");
		let evidence: ICO = {
			logo: this.domain + $("#profile_header > div > div.ico_information > div.row > div.image > img").attr("src"),
			location: $("div:nth-child(2) > b", _.filter(data_row, d=>$("div:nth-child(1)", d).text().trim()==="Country")).text().toString(),
			website: $("#profile_header > div > div.fixed_data > div.socials > a.www").attr("href").replace("?utm_source=icobench", "").toString(),
			alias: $("#financial > div > div.box_left > div:nth-child(3) > div.value.notranslate").text().toString(),
			profile: {
				name: $("#profile_header > div > div.ico_information > div.row > div.name > h1").text(),
				bio: $("#profile_header > div > div.ico_information > div.row > div.name > h2").text(),
				description: $("#profile_header > div > div.ico_information > p").text(),
			},
			social: {
				twitter: $("#profile_header > div > div.fixed_data > div.socials > a.twitter").attr("href"),
			    facebook: $("#profile_header > div > div.fixed_data > div.socials > a.facebook").attr("href"),
			    medium: $("#profile_header > div > div.fixed_data > div.socials > a.medium").attr("href"),
			    // blog: string,
			    // linkedin: string,
			    telegram: $("#profile_header > div > div.fixed_data > div.socials > a.telegram").attr("href"),
			    youtube: $("#profile_header > div > div.ico_information > div.video").attr("onclick") && $("#profile_header > div > div.ico_information > div.video").attr("onclick").split("'")[1],
			    // instagram: string,
			    reddit: $("#profile_header > div > div.fixed_data > div.socials > a.reddit").attr("href"),
			    // slack: string,
			    // gitter: string,
			    wiki: $("#profile_header > div > div.fixed_data > div.socials > a.wiki").attr("href"),
			    bitcointalk: $("#profile_header > div > div.fixed_data > div.socials > a.bitcointalk").attr("href"),
			    // google_plus: string,
			    // kakao: string,
			    // discord: string,
			    // dribbble: string,
			    // weibo: string,
			},
			project: {
				// license: string,
			 //    status: string,
			 //    ico_status: string,
			    whitepaper: $("#profile_content > div > div.content > div.navigation_mobile > div > a.notranslate").attr("href"),
			    // email: string,
			    platform: $("#financial > div > div.box_left > div:nth-child(4) > div.value.notranslate").text(),
			    // etherian: string,
			}
		};


		return evidence;

	}
	async criminate(evidence: ICO, intell: Intelligence) {
		// impl
		// debug("evidence:", evidence);
		// await request.put(url, evidence);
		return evidence;
	}

}

export default ICOBenchDetail;
