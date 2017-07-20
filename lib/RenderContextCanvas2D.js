import jQuery from 'jquery';

import { RenderContext } from './RenderContext.js';
import { Rect, Point } from './Geometry.js';
import { Events } from './Event.js';
import { getDecompositedScale } from './Matrix.js';

class RenderContextCanvas2D extends RenderContext
{
	constructor(config)
	{
		super(config);

		this._width = this.getCanvasContainer().width();
		this._height = this.getCanvasContainer().height();
		
		this._camera = null;
		
		this._mousePoint = new Point();
		
		this._canvas = jQuery('<canvas style="" width="' + this._width + 'px" height="' + this._height + 'px"/>')[0];
		
		this._canvas.addEventListener('mousedown', this._doOnMouseDown.bind(this), false);
		this._canvas.addEventListener('mouseup', this._doOnMouseUp.bind(this), false);
		this._canvas.addEventListener('mousemove', this._doOnMouseMove.bind(this), false);
		
		this.getCanvasContainer().append(this._canvas);

		this._context = this._canvas.getContext('2d');
		this._context.textBaseline = 'top';
		this._context.save();
		
		this._cachedTextureRect = new Rect();
	}
	
	// override
	doBeforeRender()
	{
		this._context.restore();
		this._context.save();
		this._context.fillStyle = this.getBackgroundColor().getCss();
		this._context.fillRect(0, 0, this._width, this._height);
	}
	
	// override
	switchCamera(camera)
	{
		this._camera = camera;
		if(this._camera) {
			this._context.restore();
			this._context.save();
			this._context.beginPath();
			const viewpoint = this._camera.getViewportPixels();
			this._context.rect(viewpoint.x, viewpoint.y, viewpoint.width, viewpoint.height);
			this._context.clip();
		}
	}

	// override
	drawRect(size, color, matrix)
	{
		this._doApplyMatrix(matrix);
		this._context.fillStyle = color.getCss();
		this._context.fillRect(0, 0, size.width, size.height);
	}
	
	// override
	drawText(text, color, font, matrix)
	{
		this._doApplyMatrix(matrix);
		if(font) {
			this._context.font = font.getCss();
		}
		this._context.fillStyle = color.getCss();
		this._context.fillText(text, 0, 0);
	}
	
	// override
	measureText(text, font)
	{
		if(font) {
			this._context.font = font.getCss();
		}
		return this._context.measureText(text);
	}
	
	// override
	drawTexture(texture, sourceRect, matrix)
	{
		if(! texture.didLoad()) {
			return;
		}

		let srcRect = sourceRect;
		if(! srcRect) {
			srcRect = this._cachedTextureRect;
			srcRect.x = 0;
			srcRect.y = 0;
			srcRect.width = texture.getWidth();
			srcRect.height = texture.getHeight();
		}
		this._doApplyMatrix(matrix);
		this._context.drawImage(texture.getHtmlImage(),
			srcRect.x, srcRect.y, srcRect.width, srcRect.height,
			0, 0, srcRect.width, srcRect.height
		);
	}
	
	_doApplyMatrix(matrix)
	{
		if(this._camera && this._camera.getMatrix()) {
			this._context.setTransform.apply(this._context, this._camera.getInvertedMatrix().toCanvas2D());
			this._context.transform.apply(this._context, matrix.toCanvas2D());
			
			const viewpoint = this._camera.getViewportPixels();
			let x = viewpoint.x;
			let y = viewpoint.y;
			const scale = getDecompositedScale(matrix);
			if(scale.x) {
				x /= scale.x;
			}
			if(scale.y) {
				y /= scale.y;
			}
			this._context.translate(x, y);
		}
		else {
			this._context.setTransform.apply(this._context, matrix.toCanvas2D());
		}
	}
	
	_doTranslateMousePoint(e)
	{
		let rect = this._canvas.getBoundingClientRect();
		this._mousePoint.x = e.clientX - rect.left;
		this._mousePoint.y = e.clientY - rect.top;
	}

	_doOnMouseDown(e)
	{
		this._doTranslateMousePoint(e);
		this.getApplication().getEventQueue().post(Events.touchPressed, this._mousePoint.clone());
	}

	_doOnMouseUp(e)
	{
		this._doTranslateMousePoint(e);
		this.getApplication().getEventQueue().post(Events.touchReleased, this._mousePoint.clone());
	}

	_doOnMouseMove(e)
	{
		this._doTranslateMousePoint(e);
		this.getApplication().getEventQueue().post(Events.touchMoved, this._mousePoint.clone());
	}

}

export { RenderContextCanvas2D };
