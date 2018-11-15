/**
 * 工具接口
 */
interface X {
	each(arry: any[], asyncFunc: AsyncFunc): Promise<any>;
	eachSync(arry: any[], asyncFunc: AsyncFunc): Promise<any>;
}

/**
 * 回调函数接口
 */
interface AsyncFunc {
	(item: any, index: number): any
}



const x: X = {
	each: async function (arry: any[], asyncFunc: (item: any, index?: number) => any): Promise<any> {
		let promiseAll = [];
		arry.forEach((item, index) => {
			promiseAll.push(asyncFunc(item, index));
		});

		let r = await Promise.all(promiseAll);

		return r;
	},
	eachSync: async function(arry: any[], asyncFunc: AsyncFunc): Promise<any> {
		let rs = [];
		for (let i = 0; i < arry.length; i++) {
			let r = await asyncFunc(arry[i], i);
			rs.push(r);
		}

		return rs;
	}
};

export default x;
