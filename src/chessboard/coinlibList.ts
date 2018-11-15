/**
 * 搜集器
 */
import { Intelligence } from "../case";
import CoinlibList from "../case/CoinlibList";
import x from "../lib/common/x";
import util from "../lib/common/util";
import { Task } from "./";


const entry = "https://coinlib.io/";
let index = 5;
let max = 91;

export let task: Task = async() => {
	let coinlibList = new CoinlibList({
		domain: entry,
		headless: true,
		force: false,
		slave: 1,
		targetDomain: "https://www.feixiaohao.tech"
	});
	do {
		coinlibList.gather(new Intelligence({
			path: "/coins?page=" + index
		}));
	} while (++index <= max)
	let reuslt = await coinlibList.start();
	return reuslt;
}
