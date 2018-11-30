import { Intelligence, Case, Slammer, CaseOption } from "../";
import TrivialTokenList from "./TrivialTokenList";
import * as Debug from "debug";

const debug = Debug("crawler:case:TrivialTagList");

/**
 * TrivialTagList Case
 */
class TrivialTagList extends Case {
	constructor(opts: CaseOption) {
		super("trivialTagList", opts);
	}

	async interrogate(culprit, intell) {

		let trivialTokenList: TrivialTokenList = new TrivialTokenList({
			domain: this.domain
		});

		culprit.metric_names.forEach(metric_name=> {
			culprit.category_names.forEach(category_name=> {
				let intell: Intelligence = new Intelligence({
					path: "/list/tokens-with-tags/?tags=" + encodeURIComponent(metric_name) + "," + encodeURIComponent(category_name)
				});
			});
		});

		let evidence = await trivialTokenList.start();

		return evidence;
	}

	async criminate(evidence, intell: Intelligence) {
		debug("evidence:", evidence);
		return evidence
	}
}

export default TrivialTagList;