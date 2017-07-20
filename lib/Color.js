class Color
{
	static fromRGB(r, g, b)
	{
		return new Color(r, g, b, 255);
	}

	static fromRGBA(r, g, b, a)
	{
		return new Color(r, g, b, a);
	}
	
	static fromValue(v)
	{
		return new Color(
			(v >> 16) & 0xff,
			(v >> 8) & 0xff,
			v & 0xff,
			(v >> 24) & 0xff
		);
	}

	constructor(r, g, b, a)
	{
		this._r = r;
		this._g = g;
		this._b = b;
		this._a = (a === undefined ? 255 : a | 0);
		this._css = null;
	}
	
	static _to2Digits(v)
	{
		return v < 16 ? '0' + v.toString(16) : v.toString(16);
	}

	getCss()
	{
		if(this._css === null) {
			if(this._a >= 255) {
				this._css = '#' + Color._to2Digits(this._r) + Color._to2Digits(this._g) + Color._to2Digits(this._b);
			}
			else {
				this._css = 'rgba(' + this._r + ',' + this._g + ',' + this._b + ',' + this._a / 255 + ')';
			}
		}
		
		return this._css;
	}

}

Color.white = Color.fromRGB(255, 255, 255);
Color.black = Color.fromRGB(0, 0, 0);
Color.blue = Color.fromRGB(0, 0, 255);
Color.red = Color.fromRGB(255, 0, 0);
Color.green = Color.fromRGB(0, 255, 0);
Color.yello = Color.fromRGB(255, 255, 0);
Color.purple = Color.fromRGB(80, 0, 80);

export { Color };
