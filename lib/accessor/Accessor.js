import { Getter } from './Getter';
import { Setter } from './Setter';

class Accessor
{
	static create(getter, setter)
	{
		if(getter && getter._x_isAccessor) {
			return getter;
		}

		if(arguments.length >= 2) {
			return new Accessor(Getter.create(getter), Setter.create(setter));
		}
	}

	constructor(getter, setter)
	{
		this._x_isAccessor = true;

		this._getter = Getter.create(getter);
		this._setter = Setter.create(setter);
	}
	
	get()
	{
		return this._getter.get();
	}
	
	set(value)
	{
		this._setter.set(value);
	}

}

export { Accessor };

