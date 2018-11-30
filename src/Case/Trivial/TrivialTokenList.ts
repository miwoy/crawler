import { Intelligence, Case, Slammer, CaseOption } from "../";
import TrivialToken from "./TrivialToken";
import * as Debug from "debug";


const debug = Debug("crawler:case:TrivialTokenList");


/**
 * TrivialTokenList Case
 */
class TrivialTokenList extends Case {
	constructor(opts: CaseOption) {
		super("trivialTokenList", opts);
	}

	async interrogate(culprit, intell) {

		let trivialToken: TrivialToken = new TrivialToken({
			domain: "https://api.trivial.co"
		});

		culprit.forEach(cul=> {
			trivialToken.gather(new Intelligence({
				path: "/tokens/" + cul.address
			}));
		});

		let result = await trivialToken.start();

		return result;
	}

	async criminate(evidence, intell: Intelligence) {
		debug("evidence:", evidence);
		return evidence
	}
}


export default TrivialTokenList;