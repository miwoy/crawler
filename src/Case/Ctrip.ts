import { Intelligence, Case, Slammer } from "./";
import * as cheerio from "cheerio";
import request from "axios";
import * as fs from "fs";
import * as _ from "lodash";
import * as Debug from "debug";
import x from "../lib/common/x";


const debug = Debug("crawler:case:Ctrip");

/**
 * 区块链项目（BTC,ETH,OTHER）
 * 		项目ICO
 * 			ICO方式（发行token（主链加密货币，智能合约代币，众筹凭证））
 * 	  主链应用
 * 	  智能合约应用
 */

interface Evidence {
    ACityCode: string; // 目的地城市编号
    AAirportName: string; // 目的地机场名
    ATerminal: string; // 目的地航站楼
    ActADateTime: string; // 实际到达时间
    ActDDateTime: string; // 实际出发时间
    DAirportName: string; //出发地机场名
    DCityCode: string; // 出发地城市编号
    DTerminal: string; // 出发地航站楼
    FlightCompany: string; // 航空公司
    FlightDuration: string; // 实际飞行时间
    FlightNo: string; // 航班号
    PlanADateTime: string; // 计划到达时间
    PlanDDateTime: string; // 计划出发时间
    Status: string; // 状态
}


class Ctrip extends Case {
    constructor(opts) {
        super("ctrip", opts);
    }
    async interrogate(culprit, intell) {
        // impl
        let $ = cheerio.load(culprit);
        let ul = $("#showFlights > div.search-wrap.clearfix > div > div.search-result > div.search-bd > ul > li");
        let lis = $("li", ul);
        let evidences: Evidence[] = [];
        
        for (let index = 0; index < ul.length; index++) {
            const ele = ul[index];

            let evidence: Evidence = {
                ACityCode: intell.attach.ACityCode, // 目的地城市编号
                AAirportName: $("div.inl.city-arrive", ele).text().split(" ")[0],
                ATerminal: $("div.inl.city-arrive", ele).text().split(" ")[1],
                DCityCode: intell.attach.DCityCode, // 出发地城市编号
                DAirportName: $("div.inl.city-departure", ele).text().split(" ")[0], //出发地机场名  
                DTerminal: $("div.inl.city-departure", ele).text().split(" ")[1], // 出发地航站楼
                FlightCompany: $("div.inl.flight > span", ele).text(), // 航空公司
                FlightNo: $("div.inl.flight > strong", ele).text(), // 航班号
        
                PlanADateTime: $("div.inl.time-arrive > strong", ele).text().split(" ")[1], // 计划到达时间
                PlanDDateTime: $("div.inl.time-departure > strong", ele).text().split(" ")[1], // 计划出发时间
                ActADateTime: $("div.inl.time-arrive > span", ele).text().split(" ")[1], // 实际到达时间
                ActDDateTime: $("div.inl.time-departure > span", ele).text().split(" ")[1], // 实际出发时间
                FlightDuration: $("div.inl.progress > div > span.lenth", ele).text(), // 实际飞行时间
                Status: $("div.inl.status.fsans > i", ele).text(), // 状态
            }

            evidences.push(evidence);
            
        }

        return evidences;

    }
    async criminate(evidences: Evidence[], intell: Intelligence) {
        console.log(evidences.length)
        fs.writeFileSync("./ctrip.json", JSON.stringify(evidences));
        return evidences;
    }

}

export default Ctrip;
