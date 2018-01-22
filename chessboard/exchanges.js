import { Intelligence } from "../case";
import FXH_Exchanges from "../case/FXH_Exchanges";
import { x, util } from "../lib/common";

const fxhentry = "https://www.feixiaohao.com";
let index = 1;
let max = 1;

let main = async() => {
	let fxh_exchanges = new FXH_Exchanges({
		domain: fxhentry
	});
	do {
		fxh_exchanges.gather(new Intelligence({
			// path: "/list_" + index + ".html?" + Date.now()
		}));
	} while (++index <= max)
	let reuslt = await fxh_exchanges.start();
}

main().catch((err) => console.log(err));
