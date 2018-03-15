/**
 * 搜集器
 */
import { Intelligence } from "../case";
import Chinaz from "../case/Chinaz";
import { x, util } from "../lib/common";

const chinazentry = "http://tool.chinaz.com";

let main = async() => {
	let chinaz = new Chinaz({
		domain: chinazentry
	});

	chinaz.gather(new Intelligence({
		path: "/history/?ht=1&h=www.8btc.com"
	}));

	let reuslt = await chinaz.start();
	console.log("success")
}

main().catch((err) => console.log(err));
