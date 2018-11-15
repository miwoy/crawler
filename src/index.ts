import * as process from 'process';
import * as fs from "fs";
import * as path from "path";
import { Task } from "./chessboard";



const args = process.argv.slice(2); // 接受参数

// 执行
args.forEach(async arg=> {
	let taskPath = path.resolve(__dirname, "chessboard", arg + ".js");
	if (fs.existsSync(taskPath)) {
		// let task:{task: Task} = require(taskPath);
		let task = await import(taskPath);
		console.log(task, taskPath)
		task.task().then(d=>console.log(`Task ${arg} success.`))//.catch(err=> console.log(`Task ${arg} error:`, err));
	} else {
		console.error(`file ${arg} not found`);
	}
});


