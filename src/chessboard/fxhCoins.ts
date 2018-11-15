/**
 * 搜集器
 */
import { Intelligence } from "../case";
import FXH_Coins from "../case/FXHCoins";
import x from "../lib/common/x";
import util from "../lib/common/util";
import { Task } from "./";


const fxhentry = "https://www.feixiaohao.com";
let index = 1;
let max = 22;

export let task: Task = async() => {
	let fxh_coins = new FXH_Coins({
		domain: fxhentry,
		headless: true,
		force: true,
		targetDomain: "https://www.feixiaohao.tech"
	});
	do {
		fxh_coins.gather(new Intelligence({
			path: "/list_" + index + ".html?" + Date.now()
		}));
	} while (++index <= max)
	let reuslt = await fxh_coins.start();
	return reuslt;
}
