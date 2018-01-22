import { Intelligence } from "../case";
import FXH_Exchanges from "../case/FXH_Exchanges";
import FXH_Exchange from "../case/FXH_Exchange";
import { x, util } from "../lib/common";

const fxhentry = "https://www.feixiaohao.com/";
let index = 1;
// let max = 15;
let max = 1;

let main = async() => {
	// let fxh_exchanges = new FXH_Exchanges({
	// 	domain: fxhentry
	// });
	// do {
	// 	fxh_exchanges.gather(new Intelligence({
	// 		path: "/exchange/list_" + index + ".html?" + Date.now()
	// 	}));
	// } while (++index <= max)
	// let reuslt = await fxh_exchanges.start();
	
	let srcs = ["/exchange/okex", "/exchange/binance", "/exchange/bitfinex"];
	let fxh_exchange  = new FXH_Exchange({
		domain: fxhentry
	});
	srcs.forEach(p=>fxh_exchange.gather(new Intelligence({
		path: p
	})));

	await fxh_exchange.start();
}

main().catch((err) => console.log(err));
