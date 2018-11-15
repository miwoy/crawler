/**
 * 搜集器
 */
import { Intelligence } from "../Case";
import Chinaz from "../Case/Chinaz";
import { Task } from "./";


const entry = "http://tool.chinaz.com";

export let task:Task = async() => {
	let chinaz: Chinaz = new Chinaz({
		domain: entry
	});

	let intell: Intelligence = new Intelligence({
		path: "/history/?ht=1&h=www.8btc.com"
	})

	chinaz.gather(intell);

	let reuslt = await chinaz.start();
	return reuslt;
}