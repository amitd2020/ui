export default class CustomUtils {

	static isNullOrUndefined(value: any) {
		return value === null || value === undefined;
	}
	static isUndefined(value: any) {
		return value === undefined;
	}

	static isObject(value: any) {
		return value !== null && typeof value === 'object';
	}

	static isArray( value: any ) {
		return Object.prototype.toString.call( value ) === '[ object Array ]';
	}

}