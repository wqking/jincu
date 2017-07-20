class Flags
{
	constructor(value)
	{
		this._value = value | 0;
	}
	
	assignFrom(other)
	{
		this._value = other._value;
	}

	set(flags)
	{
		this._value |= flags;
	}
	
	clear(flags)
	{
		this._value &= ~flags;
	}
	
	toggle(flags)
	{
		this._value ^= flags;
	}
	
	setByBool(flags, value)
	{
		if(value) {
			this.set(flags);
		}
		else {
			this.clear(flags);
		}
	}

	has(flags)
	{
		return (this._value & flags) === flags;
	}

	hasAny(flags)
	{
		return (this._value & flags) !== 0;
	}

}

export { Flags };
