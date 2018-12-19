import { Intelligence, Case, Slammer, CaseOption} from "./";
import * as cheerio from "cheerio";
import request from "axios";
import * as fs from "fs";
import * as _ from "lodash";
import * as Debug from "debug";

const debug = Debug("crawler:case:Medium");

interface Evidence {
	uniqueSlug: string;
	title: string;
	subtitle: string;
	url: string;
	creatAt: Date;
	author: Author
}

interface Author {
	slug: string;
	name: number;
	bio?: string;
	avatar?: string;
	website?: string;
}

/**
 * Medium 案子
 */
class Medium extends Case {

	constructor(opts: CaseOption) {
		super("medium", opts);
	}

	async interrogate(culprit, intell) {

		// impl
		// let $ = cheerio.load(culprit); // 使用cheerio处理html
		if (culprit) {
			try {
				culprit = JSON.parse(culprit.split('</x>')[1]);
			} catch {
				culprit = {};
			}
			
		}
		

		let evidences: Evidence[] = [];

		if (culprit.success) {
			evidences = _.values(culprit.payload.references.Post).map(p=>{
				let user = culprit.payload.references.User[p.creatorId];
				return {
					social: intell.attach.social_id,
					unique_slug: p.uniqueSlug,
					title: p.title,
					created_at: new Date(p.createdAt),
					subtitle: p.virtuals.subtitle,
					url: intell.attach.url + "/" + p.uniqueSlug,
					author: {
						slug: user.userId,
						name: user.name,
						avatar: "https://miro.medium.com/fit/c/80/80/" + user.imageId,
						bio: user.bio,
						website: "https://medium.com/@" + user.username
					}
				}
			})
		}

		return evidences;

	}
	async criminate(evidences: Evidence[], intell: Intelligence) {
		// impl
		const url = this.reportUrl;
		const authinfo = await this.authReport()
		debug("evidence length:", evidences.length);
		for(let i=0; i < evidences.length; i++) {
			let evidence: Evidence = evidences[i];
			await request.post(url, evidence, {
				headers: {
					// "Referrer Policy": "no-referrer-when-downgrade",
					"X-CSRFTOKEN": authinfo.csrftoken,
					"Cookie": authinfo.cookie,
					// "Authorization": "Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo1LCJ1c2VybmFtZSI6ImdrYkBibG9ja3MudGVjaCIsImV4cCI6MTU0NzgwMDk4OCwiZW1haWwiOiJna2JAYmxvY2tzLnRlY2giLCJvcmlnX2lhdCI6MTU0NTIwODk4OH0.tB9O9Tjs7c3ODhoXOtHKvAi0d8rGjQSWDzHGWk7TdaU",
					"Content-Type": "application/json"
				}
			});
		}
		
		return evidences;
	}

	async authReport() {
		const url = "https://api.block123.com/api/auth/login/";
		let r = await request.post(url, {
			"email": "api@blocks.tech",
			"password": "chainnews1@#"
		})

		return {
			csrftoken: r.headers["set-cookie"][0].split(";")[0].replace("csrftoken=", ""),
			"cookie": r.headers["set-cookie"].join(";")
		}
	}

	onerror(error: ErrorConstructor): void {
		/* dosometing */
		super.onerror(error);
	}

	onend(slammer: Slammer) {
		/* dosometing */
		super.onend(slammer);
	}
}

export default Medium;
