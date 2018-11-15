/**
 * 搜集器
 */
import { Intelligence } from "../Case";
import AICoins from "../Case/AICoins";
import { Task } from "./";


const entry = "https://www.aicoin.net.cn";

export let task:Task = async() => {
	let aiCoins: AICoins = new AICoins({
		domain: entry,
		headers: {
			"Accept": "*/*",
			"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36",
			"Referer": "https://www.aicoin.net.cn/",
			"X-XSRF-TOKEN": "eyJpdiI6ImhaT1dTS3VjNWJlMGoxOUlyZHVUVEE9PSIsInZhbHVlIjoiNTlycXRzK1BYVEM4d2Ixd20ydmFoclF1cjA2cTMxblhaUHF0MTYyelBhbDEzdHVMNmtRbVdCSlpBREhRV2JBWW83UXowZzlDUFowOHZwR3BKczliWlE9PSIsIm1hYyI6IjgyYTdhNzM3ZjExODE2OGY5NmU1NjNjODA3NjExM2VmOTE3ZTEyYmU2YWQ5NzBkN2FlMDQ0ZWE3NTBlNDdlYmQifQ"
		},
		targetDomain: "https://www.feixiaohao.tech"
		// targetDomain: "http://127.0.0.1:3000"
	});

	let intell: Intelligence = new Intelligence({
		path: "/api/data/getMc?type=all"
	})

	aiCoins.gather(intell);

	let reuslt = await aiCoins.start();
	return reuslt;
}