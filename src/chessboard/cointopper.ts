/**
 * 搜集器
 */
import { Intelligence } from "../case";
import Cointopper from "../case/Cointopper";
import x from "../lib/common/x";
import util from "../lib/common/util";
import { Task } from "./";
import * as fs from "fs";


const entry = "https://cointopper.com";
let index = 1;
let max = 32;

export let task: Task = async() => {
	let cointopper = new Cointopper({
		domain: entry,
		headless: true,
		force: false,
		slave: 1,
		targetDomain: "https://www.feixiaohao.tech"
	});
	do {
		cointopper.gather(new Intelligence({
			path: "/?page=" + index
		}));
	} while (++index <= max)
	let reuslt = await cointopper.start();
	console.log(reuslt);
	fs.writeFileSync("./coins.json", JSON.stringify(reuslt));
	return reuslt;
}
