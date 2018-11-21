/**
 * 搜集器
 */
import { Intelligence, IntelligenceOption } from "../Case";
import Medium from "../Case/Medium";
import { Task } from "./";
import * as url from "url";
import request from "axios";
import schedule from "node-schedule";


const entry = "https://medium.com";

export let task:Task = async() => {

	let r = await request.get("http://127.0.0.1:8000/api/social/medium");
	let socials = r.data;


	let medium: Medium = new Medium({
		domain: entry,
		reportUrl: "http://127.0.0.1:8000/api/medium",
		sleepTime: 3000,
		force: true,
		slave: 2
	});

	/*
		1.获取medium账号列表
		2.传入情报器
		3.开始爬取
	*/
	// let mediumUrls = socials.map(s=>s.medium);
	socials.forEach(social=> {
		let intell: Intelligence = new Intelligence({
			url: social.medium + "/latest?format=json",
			attach: {
				url: social.medium,
				social_id: social.id
			}
		})

		medium.gather(intell);
	});

	let reuslt = await medium.start();
	return reuslt;
}