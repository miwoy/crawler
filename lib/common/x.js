const x = {};

x.each = async(arry, asyncFunc) => {
	let promiseAll = [];

	arry.forEach(key => {
		promiseAll.push(asyncFunc(key));
	});

	let r = await Promise.all(promiseAll);

	return r;
};
x.eachSync = async(array, asyncFunc) => {
	let rs = [];
	for (let i = 0; i < array.length; i++) {
		let r = await asyncFunc(array[i], i);
		rs.push(r);
	}

	return rs;
};

export default x;
