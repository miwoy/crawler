/**
 * 搜集器
 */
import { Intelligence } from "../case";
import Binance from "../case/binance";
import { x, util } from "../lib/common";

const chinazentry = "https://info.binance.com/cn/currencies/";
let binance = new Binance({ domain: "https://info.binance.com/cn/currencies/" });
var names = ',英文名,HT,Zilliqa,Elastos,Polymath Network,SingularityNET,Credits,ArcBlock,Bluzelle,CRYPTO20,Telcoin,ChatCoin,Ubique Chain of Things,OriginTrail,Universa,AppCoins,UnlimitedIP,Mobius,Crypterium,Rock,BOTTOS,Refereum,Bankex,indaHash,SwissBorg,Zeepin,SXDT,UgChain,Swarm,Blockport,ENT Cash,ZAP,DADI,Bloom,Ocoin,IHTCoin,Selfkey,Aurora DAO,Lamden,Covesting,InsurePal,CoinPoker,FidentiaX,BitDegree,EZToken,Hacken,aXpire,GUTS Tickets,Rebellious,Ethorse,CargoX,SXUT,Ink Protocol,Bezop,Polis,EchoLink,TOPCHAIN,AidCoin,BioCoin,Pareto Network,Leverj,Block Array,Karma,True USD,SureRemit,Block Array,Karma,True USD,SureRemit,JET8,Devery,Gatcoin,Loci,Global Jobcoin,Dether,Sether,Tokenbox,Travelflex,Vezt,MNTP,Smartlands,Iungo,Adbank,Aigang,Copytrack,LendConnect,SENSE,Coinlancer,BitWhite,Jesus Coin,Tidex Token,STRAKS,Speed Mining Service,Ignition,Pylon Network,EtherSportz,ArbitrageCT,Equal,OP Coin,Commodity Ad Network,Nimfamoney,Qbic,Tigereum,Garlicoin,Steneum Coin,TOKYO,Galactrum,Madcoin,ATN,CTEChain,Global Social Chain,JEX Token,Yee Token,BPTN,DATA,EKT,Gems,Internet of Services,Mithril,Moac,Ruff,Tripio,WFee,Aldoctor,Coins,Hydro,KCASH,UCASH,SAFE,Beauty Chain,Nework,OFCOIN,RealChain,Travel,Zipper,Cloud-Insurance Chain,CUBE,Energy Eco Chain,Game.com,LinkEye,LiveEdu,Nucleus Vision,SDChain,CoinMeet,Fair.Game,RefToken,SelfSell,ShowHand,STK Token,SwftCoin,Molecular Future,Starchain,Bitcoin New,CanonChain,Halalchain,Lightcoin,SpaceChain,Bishen Token,INS Ecosystem,All Sports Coin,AVH,ACChain,Alphacat,AWARE,BABB,Bee Token,BitClave,Bitcoin Atom,Bitcoin God,Bitcoin Private,Borderless,Candy Token,CanYa,carVertical,Cashaa,Centrality,CFun,Cleverness,Cloud,CPChain,CryptopiaFeeShares,Datawallet,Debitum Network,DUBI,DMarket,DRP Utility,EduCoin,Electrify.Asia,Envion,Electronic PK Chain,Escroco,EtherDelta Token,Etherecash,Experty,Fortuna,Fusion,Gamechain System,Gladius Token,Graft,Gram,Harvest Masternode Coin,HQX,IDEX Membership,Indicoin,Insights Network,Interplanetary Broadcast Coin,InvestDigital,Jibrel Network,Kzcash,LALA World,Leadcoin,Litecoin Cash,Lympo,Maggie Token,Matrix AI Network,Measurable Data,Medicalchain,Mixin,MktCoin,Monero Gold,Neurotoken,Nitro,Octoin Coin,Pundi X,Purpose,Qube,QunQun,Ravencoin,READ,Restart Energy MWAT,Republic Protocol,ShareX,Sharpe Capital,Shekel,ShipChain,SHOW,Snetwork,Sparks,SpherePay,STAC,Superior Coin,TE-FOOD,THEKEY,Theta,TimesCoin,,';
let main = async() => {
	names.split(",").map(name => {
		if (name)
		binance.gather(new Intelligence({
			path: name.split(" ")[0]
		}));
	})


	await binance.start();
	console.log("success")
}

main().catch((err) => console.log(err));
