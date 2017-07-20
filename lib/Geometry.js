class Vector
{
	constructor(x, y, z)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}
	
	assignFrom(other)
	{
		this.x = other.x;
		this.y = other.y;
		this.z = other.z;

		return this;
	}
	
	clone()
	{
		return new Vector(this.x, this.y, this.z);
	}

	equals(other)
	{
		return this.x === other.x
			&& this.y === other.y
			&& this.z === other.z
		;
	}
	
	toString()
	{
		return 'x=' + this.x + ' y=' + this.y;
	}

}

let Point = Vector;
export { Point };

let Scale = Vector;
export { Scale };


class Rect
{
	constructor(x, y, width, height)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.width = width || 0;
		this.height = height || 0;
	}

	assignFrom(other)
	{
		this.x = other.x;
		this.y = other.y;
		this.width = other.width;
		this.height = other.height;

		return this;
	}

	clone()
	{
		return new Rect(this.x, this.y, this.width, this.height);
	}

	equals(other)
	{
		return this.x === other.x
			&& this.y === other.y
			&& this.width === other.width
			&& this.height === other.height
		;
	}

	toString()
	{
		return 'x=' + this.x + ' y=' + this.y + ' w=' + this.width + ' h=' + this.height;
	}

}

export { Rect };


class Size
{
	constructor(width, height)
	{
		this.width = width || 0;
		this.height = height || 0;
	}

	assignFrom(other)
	{
		this.width = other.width;
		this.height = other.height;

		return this;
	}

	clone()
	{
		return new Size(this.width, this.height);
	}

	equals(other)
	{
		return this.width === other.width
			&& this.height === other.height
		;
	}

	toString()
	{
		return 'w=' + this.width + ' h=' + this.height;
	}

}

export { Size };

export function isInRect(point, rect)
{
	return (point.x || 0) >= (rect.x || 0) && (point.x || 0) <= (rect.x || 0) + (rect.width || 0)
		&& (point.y || 0) >= (rect.y || 0) && (point.y || 0) <= (rect.y || 0) + (rect.height || 0)
	;
}

