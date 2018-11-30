/**
 * 搜集器
 */
import { Intelligence } from "../case";
import ICOBench from "../case/ICOBench";
import x from "../lib/common/x";
import util from "../lib/common/util";
import * as fs from "fs";
import { Task } from "./";


const fxhentry = "https://icobench.com";
let index = 1;
let max = 401;

export let task: Task = async() => {
	let icoBench = new ICOBench({
		domain: fxhentry,
		// headless: true,
		force: true,
		// sleepTime: 30000,
		// targetDomain: "https://www.feixiaohao.tech"
	});
	do {
		icoBench.gather(new Intelligence({
			path: "/icos?page=" + index
		}));
	} while (++index <= max)
	let reuslt = await icoBench.start();
	fs.writeFileSync("./icobench.json", JSON.stringify(reuslt));

	return reuslt;
}
