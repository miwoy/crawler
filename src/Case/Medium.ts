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
			evidences = culprit.payload.posts.map(p=>{
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
	async criminate(evidences: Evidence, intell: Intelligence) {
		// impl
		const url = this.reportUrl;
		debug("evidence length:", evidences.length);
		for(let i=0; i < evidences.length; i++) {
			let evidence: Evidence = evidences[i];
			await request.post(url, evidence);
		}
		
		return evidences;
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
