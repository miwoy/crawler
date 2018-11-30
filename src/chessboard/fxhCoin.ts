/**
 * 搜集器
 */
import { Intelligence } from "../Case";
import FXHCoin from "../Case/FXHCoin";
import { Task } from "./";
const icodata = require("../../icodata.json");



const entry = "https://www.feixiaohao.com";

export let task:Task = async() => {
	let fxhCoin: FXHCoin = new FXHCoin({
		domain: entry,
		headless: true,
		force: true,
		reportUrl: "https://www.feixiaohao.tech"
	});

	icodata.forEach(ico=> {
		if (ico.fxhurl) {
			let intell: Intelligence = new Intelligence({
				path: ico.fxhurl.replace("https://www.feixiaohao.com", ""),
				attach: ico
			});
			fxhCoin.gather(intell);
		}
	});

	let reuslt = await fxhCoin.start();

	return reuslt;
}