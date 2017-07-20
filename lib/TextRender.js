import { Size } from './Geometry.js';
import { Application } from './Application.js';
import { Color } from './Color.js';

class TextRender
{
	constructor(text, font, color)
	{
		this._text = text;
		this._font = font;
		this._color = color || Color.white;
		this._size = new Size(-1, -1);
	}

	setText(text)
	{
		this._text = text;
		this._size.width = -1;
	}
	
	setFont(font)
	{
		this._font = font;
	}
	
	getSize()
	{
		if(this._size.width < 0) {
			const size = Application.getInstance().getRenderContext().measureText(this._text, this._font);
			this._size.width = size.width;
			this._size.height = this._font.getSize();
		}

		return this._size;
	}

	draw(renderContext, matrix)
	{
		renderContext.drawText(this._text, this._color, this._font, matrix);
	}
	
}

export { TextRender };
