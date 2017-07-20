import { TypeUtil } from '../util/TypeUtil.js';
import { Util } from '../util/Util.js';

class Getter
{
	static create(getter, key)
	{
		if(TypeUtil.isNullOrUndefined(getter)) {
			return null;
		}

		if(getter && getter._x_isGetter) {
			return getter;
		}
		else {
			return new Getter(getter, key);
		}
	}

	constructor(getter, key)
	{
		this._x_isGetter = true;

		this._type = TypeUtil.detectType(getter);
		this._getter = getter;
		
		switch(this._type) {
		case TypeUtil.types.tNull:
		case TypeUtil.types.tUndefined:
		case TypeUtil.types.tBoolean:
		case TypeUtil.types.tNumber:
		case TypeUtil.types.tString:
			this.get = this._doGetByConstant;
			break;

		case TypeUtil.types.tFunction:
			this.get = this._doGetByFunction;
			break;

		case TypeUtil.types.tObject:
			this.get = this._doGetByObject;
			this._key = key || Util.getFirstKey(getter);
			break;
			
		default:
			this.get = null;
			break;
		}
	}

	_doGetByConstant()
	{
		return this._getter;
	}

	_doGetByFunction()
	{
		return this._getter();
	}
	
	_doGetByObject()
	{
		return this._getter[this._key];
	}

}

export { Getter };
