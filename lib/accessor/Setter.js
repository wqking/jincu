import { TypeUtil } from '../util/TypeUtil.js';
import { Util } from '../util/Util.js';

class Setter
{
	static create(setter, key)
	{
		if(TypeUtil.isNullOrUndefined(setter)) {
			return null;
		}

		if(setter && setter._x_isSetter) {
			return setter;
		}
		else {
			return new Setter(setter, key);
		}
	}

	constructor(setter, key)
	{
		this._x_isSetter = true;

		this._type = TypeUtil.detectType(setter);
		this._setter = setter;
		
		switch(this._type) {
		case TypeUtil.types.tNull:
		case TypeUtil.types.tUndefined:
		case TypeUtil.types.tBoolean:
		case TypeUtil.types.tNumber:
		case TypeUtil.types.tString:
			this.set = this._doSetByConstant;
			break;

		case TypeUtil.types.tFunction:
			this.set = this._doSetByFunction;
			break;

		case TypeUtil.types.tObject:
			this.set = this._doSetByObject;
			this._key = key || Util.getFirstKey(setter);
			break;
			
		default:
			this.set = null;
			break;
		}
	}

	_doSetByConstant()
	{
	}

	_doSetByFunction(value)
	{
		this._setter(value);
	}
	
	_doSetByObject(value)
	{
		this._setter[this._key] = value;
	}

}

export { Setter };
