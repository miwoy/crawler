/**
 * 搜集器
 */
import { Intelligence } from "../Case";
import Ctrip from "../Case/Ctrip";
import { Task } from "./";


var entry = "http://flights.ctrip.com"
export let task: Task = async () => {
    let ctrip: Ctrip = new Ctrip({
        domain: entry,
        headless: true,
        headers: {
            "Accept": "text/html, application/xhtml+xml,application/xml; q=0.9, image/webp,image/apng, */*;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "en,zh-CN;q=0.9,zh;q=0.8",
            "Connection": "keep-alive",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36(KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36"
        }
    });

    let intell: Intelligence = new Intelligence({
        path: "/actualtime/SHA-BJS/t20181118",
        attach: {
            ACityCode: "BJS",
            DCityCode: "SHA"
        }
    })

    ctrip.gather(intell);
    let reuslt = await ctrip.start();
    return reuslt;
}