const now = (): number => new Date().getTime();

type ThrottleOptions = {
	leading?: boolean;
	trailing?: boolean;
};

export default function throttle<T extends (...args: any[]) => any>(
	func: T,
	wait: number,
	options?: ThrottleOptions
): T & { cancel: () => void } {
	let timeout: number | null | NodeJS.Timeout, context: any, args: any, result: any;
	let previous = 0;
	if (!options) options = {};

	const later = (): void => {
		previous = options?.leading === false ? 0 : now();
		timeout = null;
		result = func.apply(context, args);
		if (!timeout) context = args = null;
	};

	const throttled = function (this: any, ..._args: any[]): any {
		const _now = now();
		if (!previous && options?.leading === false) previous = _now;
		const remaining = wait - (_now - previous);
		context = this;
		args = _args;
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			previous = _now;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		} else if (!timeout && options?.trailing !== false) {
			timeout = setTimeout(later, remaining);
		}
		return result;
	} as T & { cancel: () => void };

	throttled.cancel = function (): void {
		clearTimeout(timeout!);
		previous = 0;
		timeout = context = args = null;
	};
	return throttled;
}
