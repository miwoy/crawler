import { Intelligence, Case, Slammer, CaseOption } from "../";
import * as Debug from "debug";


const debug = Debug("crawler:case:TrivialToken");

interface Evidence {

}

/**
 * TrivialToken Case
 */
class TrivialToken extends Case {
	constructor(opts: CaseOption) {
		super("trivialToken", opts);
	}

	async interrogate(culprit, intell) {
		let evidence = culprit;
		return evidence;
	}

	async criminate(evidence: Evidence, intell: Intelligence) {
		debug("evidence:", evidence);
		return evidence
	}
}

export default TrivialToken;