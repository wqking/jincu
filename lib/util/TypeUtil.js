import jQuery from 'jquery';

class TypeUtil
{
	static isFunction(v)
	{
		if(jQuery.isFunction) return jQuery.isFunction(v);
		return typeof(v) === 'function';
	}
	
	static isArray(v)
	{
		if(jQuery.isArray) return jQuery.isArray(v);
		return v instanceof Array;
	}
	
	static isObject(v)
	{
		return typeof(v) === "object" || jQuery.isPlainObject(v);
	}
	
	static isString(v)
	{
		return typeof(v) === "string";
	}

	static isNumber(v)
	{
		return typeof(v) === "number";
	}
	
	static isBoolean(v)
	{
		return typeof(v) === "boolean";
	}
	
	static isNullOrUndefined(value)
	{
		return value === null || value === undefined;
	}
	
	static detectType(value)
	{
		if(value === null) return TypeUtil.types.tNull;
		if(value === undefined) return TypeUtil.types.tUndefined;
		if(TypeUtil.isBoolean(value)) return TypeUtil.types.tBoolean;
		if(TypeUtil.isNumber(value)) return TypeUtil.types.tNumber;
		if(TypeUtil.isString(value)) return TypeUtil.types.tString;
		if(TypeUtil.isFunction(value)) return TypeUtil.types.tFunction;
		if(TypeUtil.isArray(value)) return TypeUtil.types.tArray;
		if(TypeUtil.isObject(value)) return TypeUtil.types.tObject;
		
		return TypeUtil.types.tUnknown;
	}

}

TypeUtil.types = {
	tUnknown: 0,
	tUndefined: 1,
	tNull: 2,
	tBoolean: 3,
	tNumber: 4,
	tString: 5,
	tFunction: 6,
	tArray: 7,
	tObject: 8,
};

export { TypeUtil };
