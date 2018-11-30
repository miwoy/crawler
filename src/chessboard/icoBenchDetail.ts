/**
 * 搜集器
 */
import { Intelligence } from "../Case";
import ICOBenchDetail from "../Case/ICOBenchDetail";
import { Task } from "./";



const entry = "https://icobench.com";

export let task:Task = async() => {
	let icoBenchDetail: ICOBenchDetail = new ICOBenchDetail({
		domain: entry,
		// headless: true,
		force: true,
		// reportUrl: "https://www.feixiaohao.tech"
	});

	let intell: Intelligence = new Intelligence({
				path: '/ico/hetachain'
			});
	icoBenchDetail.gather(intell);
	let reuslt = await icoBenchDetail.start();

	return reuslt;
}