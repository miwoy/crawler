let arg = process.argv[2];

if (arg === "coin") {
	require("./chessboard/coins");
} else if (arg === "exchange") {
	require("./chessboard/exchanges");
}

