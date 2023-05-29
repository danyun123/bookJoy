import localForage from "localforage";

export function setLocalForage(key: string, data: any, cb?: (success: any) => void, cb2?: (err: any) => void) {
	localForage
		.setItem(key, data)
		.then((value) => {
			if (cb) cb(value);
		})
		.catch((err) => {
			if (cb2) cb2(err);
		});
}

export function getLocalForage(key: string, cb: (err: any, value: any) => void) {
	localForage.getItem(key, (err, value) => {
		cb(err, value);
	});
}

export function removeLocalForage(key: string, cb?: () => void, cb2?: (err: any) => void) {
	localForage
		.removeItem(key)
		.then(() => {
			if (cb) cb();
		})
		.catch((err) => {
			if (cb2) cb2(err);
		});
}

export function clearLocalForage(cb?: () => void, cb2?: (err: any) => void) {
	localForage
		.clear()
		.then(() => {
			if (cb) cb();
		})
		.catch((err) => {
			if (cb2) cb2(err);
		});
}

export function lengthLocalForage(cb?: (numberOfKeys: number) => void) {
	localForage
		.length()
		.then((numberOfKeys) => {
			if (cb) cb(numberOfKeys);
			console.log(numberOfKeys);
		})
		.catch((err) => {
			console.log(err);
		});
}

export function iteratorLocalForage() {
	localForage
		.iterate(function (value, key, iterationNumber) {
			console.log([key, value]);
		})
		.then(() => {
			console.log("Iteration has completed");
		})
		.catch((err) => {
			console.log(err);
		});
}

export function support(): boolean {
	const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || null;
	return !!indexedDB;
}
