class RectRender
{
	constructor(color, size)
	{
		this._color = color;
		this._size = size;
	}
	
	getSize()
	{
		return this._size;
	}

	draw(renderContext, matrix)
	{
		renderContext.drawRect(this._size, this._color, matrix);
	}
	
}

export { RectRender };
