import jQuery from 'jquery';

import { TypeUtil } from './TypeUtil';

class Util
{
	static setIfNotExist(obj, propertyName, value)
	{
		if(obj) {
			let shouldSet = true;
			if(obj.hasOwnProperty) {
				if(obj.hasOwnProperty(propertyName)) {
					shouldSet = false;
				}
			}
			else {
				if(obj[propertyName] !== undefined) {
					shouldSet = false;
				}
			}
			if(shouldSet) {
				obj[propertyName] = value;
			}
		}
	}
	
	static hasProperty(obj, propertyName)
	{
		if(obj) {
			if(obj.hasOwnProperty) {
				if(obj.hasOwnProperty(propertyName)) {
					return true;
				}
			}
		}
		
		return false;
	}
	
	static getWithDefault(value, defaultValue)
	{
		if(TypeUtil.isNullOrUndefined(value)) {
			return defaultValue;
		}
		else {
			return value;
		}
	}
	
	static getCurrentMilliseconds()
	{
		return Date.now();
	}
	
	static millisecondsToSeconds(milliseconds)
	{
		return milliseconds / 1000;
	}
	
	static removeItemFromArray(array, item)
	{
		let index = array.indexOf(item);
		if(index >= 0) {
			array.splice(index, 1);
		}
		return index;
	}

	static removeItemFromArrayAt(array, index)
	{
		if(index >= 0 && index < array.length) {
			array.splice(index, 1);
		}
	}

	static removeItemIfFromArray(array, item, condition)
	{
		for(let i = array.length - 1; i >= 0; --i) {
			if(condition(array[i])) {
				array.splice(i, 1);
			}
		}
	}

	static applyStyles(element, styles)
	{
		if(element && styles) {
			let me = jQuery(element);
			for(let name in styles) {
				me.css(name, styles[name]);
			}
		}
	}

	static cloneObject(obj, extra)
	{
		if(! obj) {
			return obj;
		}

		if(obj.clone) {
			return obj.clone(extra);
		}

		return Object.assign({}, obj, extra);
	}
	
	static cloneArray(array)
	{
		if(! array || ! TypeUtil.isArray(array)) {
			return array;
		}
		return array.slice(0);
	}

	// Usage:
	// Util.formatString("abc {name} {name} {id}", { name : 'good', id: 'day' });
	static formatString(str, args)
	{
		if(! args) return str;
		return str.replace(/{([\w\d]+)}/g, function(match, name) { 
			return (args && typeof args[name] !== 'undefined')
				? args[name]
				: match
			;
		});
	}
	
	static generateUniqueId(name)
	{
		if(! Util._uniqueIdMap[name]) {
			Util._uniqueIdMap[name] = 0;
		}
		
		++Util._uniqueIdMap[name];
		
		return "" + Util._uniqueIdMap[name];
	}

	static encodeJson(jsonObject)
	{
		return JSON.stringify(jsonObject);
	}

	// for test
	static encodeReadableJsonArray(jsonArray)
	{
		if(! jsonArray) return 'null';

		let result = '';
		for(let data of jsonArray) {
			result += JSON.stringify(data) + " ~~~~~~~~~~~~~~~ <br />";
		}
		return result;
	}

	static setBoundValue(boundData, value)
	{
		if(TypeUtil.isFunction(boundData)) {
			boundData(value);
		}
		else if(TypeUtil.isFunction(boundData.setValue)) {
			boundData.setValue(value);
		}
		else {
			boundData.data = value;
		}
	}
	
	static getBoundValue(boundData)
	{
		if(TypeUtil.isFunction(boundData)) {
			return boundData();
		}
		else if(TypeUtil.isFunction(boundData.getValue)) {
			return boundData.getValue();
		}
		else {
			return boundData.data;
		}
	}

	static splitCamelCaseWords(text)
	{
		let result = [];
		let re = /([A-Z][a-z\d_]+)/g;
		for(;;) {
			let m = re.exec(text);
			if(! m) break;
			result.push(m[1]);
		}
		
		return result;
	}

	static degreeToRadian(degree)
	{
		return degree * Math.PI / 180;
	}

	static numberCompare(a, b)
	{
		if(a < b) return -1;
		if(a > b) return 1;
		return 0;
	}

	// Converted from C++ implementation here,
	// http://www.cprogramming.com/tutorial/computersciencetheory/merge.html
	static _mergeHelper(input, left, right, scratch, cmp)
	{
		if(right <= left + 1) {
			return;
		}

		let i = 0;
		let length = right - left + 1;
		let midpointDistance = (length >> 1);
		let l = left;
		let r = left + midpointDistance;

		Util._mergeHelper(input, left, left + midpointDistance, scratch, cmp);
		Util._mergeHelper(input, left + midpointDistance, right, scratch, cmp);

		for(i = 0; i < length; i++)
		{
			if(l < left + midpointDistance && 
					(r == right || cmp(input[l], input[r]) <= 0))
			{
				scratch[i] = input[l];
				l++;
			}
			else
			{
				scratch[i] = input[r];
				r++;
			}
		}

		for(i = left; i < right; i++)
		{
			input[i] = scratch[i - left];
		}
	}

	static mergeSort(input, cmp)
	{
		const size = input.length;
		let scratch = new Array(size);
		Util._mergeHelper(input, 0, size, scratch, cmp || Util.numberCompare);
	}

	static getFirstKey(object)
	{
		for(let key in object) return key;
		return null;
	}

	static getFirstValue(object)
	{
		for(let key in object) return object[key];
		return null;
	}

	static toInt(s)
	{
		return parseInt(s, 10);
	}

	static toFloat(s)
	{
		return parseFloat(s);
	}

	static codeIsDigit(c)
	{
		return c >= 0x30 && c <= 0x39;
	}

	static codeIsSpace(c)
	{
		return c === 32 || c === 9 || c === 10 || c === 13;
	}

}

Util._uniqueIdMap = {};

export { Util };
