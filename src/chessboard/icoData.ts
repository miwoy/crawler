/**
 * 搜集器
 */
import { Intelligence } from "../Case";
import ICOData from "../Case/ICOData";
import { Task } from "./";


// const entry = "https://www.icodata.io";
var entry = "https://baidu.com"
export let task:Task = async() => {
	let icodata: ICOData = new ICOData({
		domain: entry,
		targetDomain: "https://www.feixiaohao.tech"
	});

	let intell: Intelligence = new Intelligence({
		path: "/"
	})

	icodata.gather(intell);

	let reuslt = await icodata.start();
	return reuslt;
}