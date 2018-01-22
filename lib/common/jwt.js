import jwt from "jsonwebtoken";
import uuid from "node-uuid";


export default {
	sign: (token, secret) => {
		return jwt.sign(token, secret || conf.secret);
	},
	verify: (token, secret) => {
		return jwt.verify(token, secret || conf.secret);
	},
	getToken: () => {
		return uuid.v1();
	}
};
