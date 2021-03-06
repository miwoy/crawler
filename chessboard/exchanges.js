import { Intelligence } from "../case";
import FXH_Exchanges from "../case/FXH_Exchanges";
import FXH_Exchange from "../case/FXH_Exchange";
import { x, util } from "../lib/common";
import request from "../lib/request";
import _ from "lodash";
import ccxt from "ccxt";

const fxhentry = "https://www.feixiaohao.com/";
let index = 1;
// let max = 15;
let max = 1;

let newm = async() => {

	let exchanges = ccxt.exchanges;
	let srcs = [];
	await x.each(exchanges, async(e) => {
		try {
			let exchange = new ccxt[e]();
			await exchange.loadMarkets();
			let _s = [];
			exchange.symbols.forEach(s => {
				if (s.indexOf("/") >= 0) {
					_s.push([s.split("/")[0], s.split("/")[1]]);
				}
			});

			srcs.push({
				path: "/exchange/" + e,
				symbols: _s
			});
		} catch (e) {
			// console.log(e);
		}

	});
	
	// return console.log(srcs)
	var filer = ["/exchange/hitbtc", "/exchange/cryptopia", "/exchange/yobit", "/exchange/tidex"]
	srcs = srcs.filter(o=>filer.indexOf(o.path)>=0);
	console.log("debug", srcs)
	let fxh_exchange = new FXH_Exchange({
		domain: fxhentry
	});
	srcs.forEach(s => fxh_exchange.gather(new Intelligence({
		path: s.path,
		attach: {
			symbolsApi: s.symbolsApi,
			symbols: s.symbols
		}
	})));
	console.log(fxh_exchange.intelligences.length)
	await fxh_exchange.start();
}

newm().catch((err) => console.log(err));

let main = async() => {
	// let fxh_exchanges = new FXH_Exchanges({
	// 	domain: fxhentry
	// });
	// do {
	// 	fxh_exchanges.gather(new Intelligence({
	// 		path: "/exchange/list_" + index + ".html?" + Date.now()
	// 	}));
	// } while (++index <= max)
	// let reuslt = await fxh_exchanges.start();

	// 格式化symbolss
	let bitfinex = await request.get("https://api.bitfinex.com/v1/symbols");
	bitfinex = bitfinex.map(b => [b.slice(0, 3).toUpperCase(), b.slice(3).toUpperCase()]);
	let binance = await request.get("https://api.binance.com/api/v1/exchangeInfo");
	binance = binance.symbols.map(s => [s.baseAsset, s.quoteAsset])
	let okex = [
		"ltc_btc", "eth_btc", "etc_btc", "bch_btc",
		"btc_usdt", "eth_usdt", "ltc_usdt", "etc_usdt",
		"bch_usdt", "etc_eth", "bt1_btc", "bt2_btc",
		"btg_btc", "qtum_btc", "hsr_btc", "neo_btc",
		"gas_btc", "qtum_usdt", "hsr_usdt", "neo_usdt", "gas_usdt"
	].map(s => [s.split("_")[0].toUpperCase(), s.split("_")[1].toUpperCase()]);

	let gdax = await request.get("https://api.gdax.com/products");
	gdax = gdax.map(s => [s["base_currency"], s["quote_currency"]]);

	let kraken = await request.get("https://api.kraken.com/0/public/AssetPairs");
	kraken = _.values(kraken.result).map(s => [s["base"], s["quote"].slice(1)]);

	let hitbtc = await request.get("https://api.hitbtc.com/api/2/public/symbol");
	hitbtc = hitbtc.map(s => [s.baseCurrency, s.quoteCurrency]);

	let zb = await request.get("http://api.zb.com/data/v1/markets");
	zb = _.keys(zb).map(s => [s.split("_")[0].toUpperCase(), s.split("_")[1].toUpperCase()]);

	let huobipro = await request.get("https://api.huobi.pro/v1/common/symbols");
	huobipro = huobipro.data.map(s => [s["base-currency"].toUpperCase(), s["quote-currency"].toUpperCase()]);

	let bittrex = await request.get("https://bittrex.com/api/v1.1/public/getmarkets");
	bittrex = bittrex.result.map((item) => item.MarketName.split('-').reverse());

	let bithumb = [
		["BTC", "KRW"],
		["ETH", "KRW"],
		["DASH", "KRW"],
		["LTC", "KRW"],
		["ETC", "KRW"],
		["XRP", "KRW"],
		["BCH", "KRW"],
		["XMR", "KRW"],
		["ZEC", "KRW"],
		["QTUM", "KRW"],
		["BTG", "KRW"],
		["EOS", "KRW"]
	];

	let poloniex = await request.get("https://poloniex.com/public?command=returnTicker");

	poloniex = _.keys(poloniex).map(s => [s.split("_")[1], s.split("_")[0]]);

	let srcs = [{
		"path": "/exchange/poloniex",
		symbols: poloniex
	}, {
		"path": "/exchange/okex",
		symbols: okex
	}, {
		"path": "/exchange/binance",
		symbols: binance
	}, {
		"path": "/exchange/bitfinex",
		symbols: bitfinex
	}, {
		"path": "/exchange/gdax",
		symbols: gdax
	}, {
		"path": "/exchange/kraken",
		symbols: kraken
	}, {
		"path": "/exchange/hitbtc",
		symbols: hitbtc
	}, {
		"path": "/exchange/zb",
		symbols: zb
	}, {
		"path": "/exchange/huobipro",
		symbols: huobipro
	}, {
		"path": "/exchange/bittrex",
		symbols: bittrex
	}, {
		"path": "/exchange/bithumb",
		symbols: bithumb
	}];

	// console.log(srcs);
	let fxh_exchange = new FXH_Exchange({
		domain: fxhentry
	});
	srcs.forEach(s => fxh_exchange.gather(new Intelligence({
		path: s.path,
		attach: {
			symbolsApi: s.symbolsApi,
			symbols: s.symbols
		}
	})));

	await fxh_exchange.start();
}

// main().catch((err) => console.log(err));
