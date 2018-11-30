/**
 * 搜集器
 */
import { Intelligence } from "../Case";
import TrivialTokenList from "../Case/Trivial/TrivialTokenList";
import { Task } from "./";
import * as fs from "fs";

const entry = "https://reactbackend-dot-trivial2-188516.appspot.com";
export let task: Task = async() => {

	let res = {"category_names": ["AI_", "AR/VR_", "Accounting_", "Advertising", "Blockchain Interoperability_", "Build Dapps_", "Charity_", "Commerce_", "Computing", "Crowdfunding_", "Data Market_", "Data Storage_", "Data_", "Debit Card_", "Decentralized Exchange_", "Different Blockchains_", "Digital Assets Management_", "Digital Currency_", "Dividend Yield_", "Education_", "Electronics_", "Energy_", "Entertainment_", "Exchange_", "Finance", "Gambling_", "Gaming", "Gold Backed_", "Governance_", "Hardware_", "Healthcare_", "Identity Management_", "Insurance_", "Intellectual Property_", "Invoicing_", "IoT", "Joke and Irony_", "Lending_", "Logistics_", "Mainnet Live_", "Marketplace_", "Media_", "Messari_", "Messenger_", "Mining_", "Monetization of Personal Data_", "No Longer ERC20_", "One of a Kind?_", "Open Source_", "Oracle_", "Payments_", "Platform_", "Porn_", "Prediction Market_", "Privacy_", "Protocol", "Real Estate_", "Real World Assets_", "Recruitment_", "Reputation_", "Research_", "Retail_", "Reward Content Creators + Publishers_", "Search Engine_", "Security_", "Service_", "Smart Contracts_", "Social_", "Software_", "Sport_", "Stablecoin_", "Token Curated Registry_", "Trading and Investing_", "Transportation_", "Voting_", "Wallet_"], "metric_names": ["Active Today", "Highest Market Cap", "Most Holders", "Txs/Holder/Month", "Market Cap/MAU"]}

	let trivialTokenList: TrivialTokenList = new TrivialTokenList({
			domain: entry
		});

	res.metric_names.forEach(metric_name=> {
		res.category_names.forEach(category_name=> {
			let intell: Intelligence = new Intelligence({
				path: "/list/tokens-with-tags/?tags=" + encodeURIComponent(metric_name) + "," + encodeURIComponent(category_name.replace("_", ""))
			});
			trivialTokenList.gather(intell)
		});
	});

	let result = await trivialTokenList.start();
	// let trivial: TrivialTagList = new TrivialTagList({
	// 	domain: entry
	// });

	// let intell: Intelligence = new Intelligence({
	// 	path: "/"
	// })

	// trivial.gather(intell);

	// let result = await trivial.start();
	fs.writeFileSync("./trivial.json", JSON.stringify(reuslt));
	return result;
}