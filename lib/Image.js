import { Rect } from './Geometry.js';

class Image
{
	constructor(texture, rect)
	{
		this._texture = texture;
		this._rect = new Rect();
		if(rect) {
			this._rect.assignFrom(rect);
		}
	}
	
	draw(renderContext, matrix)
	{
		renderContext.drawTexture(this._texture, this.getRect(), matrix);
	}
	
	getTexture()
	{
		return this._texture;
	}
	
	setRect(rect)
	{
		this._rect.assignFrom(rect);
	}

	getRect()
	{
		if(this._rect.width <= 0) {
			const size = this._texture.getSize();
			this._rect.x = 0;
			this._rect.y = 0;
			this._rect.width = size.width;
			this._rect.height = size.height;
		}
		
		return this._rect;
	}
	
	getSize()
	{
		return this.getRect();
	}

	isValid()
	{
		return this._texture.isValid();
	}

}

export { Image };
