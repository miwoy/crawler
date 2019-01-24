/**
 * 搜集器
 */
import { Intelligence, IntelligenceOption } from "../Case";
import Medium from "../Case/Medium";
import { Task } from "./";
import * as url from "url";
import request from "axios";
import * as schedule from "node-schedule";


const entry = "https://medium.com";

let exec = async() => {

	let r = await request.get("https://api.block123.com/api/social/medium");
	let socials = r.data;

	let medium: Medium = new Medium({
		domain: entry,
		reportUrl: "https://api.block123.com/api/medium",
		force: true,
		slave: 1
	});

	/*
		1.获取medium账号列表
		2.传入情报器
		3.开始爬取
	*/
	// let mediumUrls = socials.map(s=>s.medium);
	socials.forEach(social=> {
		let tail = social.medium.split("/").pop();
		let url = !tail ? social.medium.slice(0, -1): social.medium;
		let intell: Intelligence = new Intelligence({
			url: url + "?format=json",
			attach: {
				url: url,
				social_id: social.id
			}
		})

		medium.gather(intell);
	});

	let reuslt = await medium.start();
	return reuslt;
}

export let task:Task = async() => {
	await exec()
	schedule.scheduleJob("Execute medium spider task", `00 00 07 * * *`, exec)
}