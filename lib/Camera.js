import { Rect, Size, Point } from './Geometry.js';
import { Application } from './Application.js';
import { Matrix } from './Matrix.js';

class Camera
{
	constructor()
	{
		this._mask = 1;
		this._viewport = new Rect(0, 0, 1, 1);
		this._worldSize = (new Size()).assignFrom(Application.getInstance().getTargetViewSize());
		this._targetViewSize = (new Size()).assignFrom(Application.getInstance().getTargetViewSize());
		this._cachedScreenSize = new Size(-1, -1);
		this._fitStrategy = Camera.fitStrategies.none;
		this._viewportInPixel = new Rect();
		this._matrix = null;
		this._invertedMatrix = new Matrix();
	}
	
	belongs(cameraId)
	{
		return (this._mask & (1 << cameraId)) !== 0;
	}

	setViewport(viewport)
	{
		this._viewport.assignFrom(viewport);
		this._doRequireRefresh();
	}

	getViewport()
	{
		this._doRefresh();
		return this._viewport;
	}

	setTargetViewSize(size)
	{
		this._targetViewSize.assignFrom(size);
		this._doRequireRefresh();
	}

	getTargetViewSize()
	{
		return this._targetViewSize;
	}
	
	setWorldSize(worldSize)
	{
		this._worldSize.assignFrom(worldSize);
	}
	
	getWorldSize()
	{
		return this._worldSize;
	}
	
	getViewportPixels()
	{
		this._doRefresh();

		const screenSize = Application.getInstance().getScreenSize();
		this._viewportInPixel.x = Math.round(screenSize.width * this._viewport.x);
		this._viewportInPixel.y = Math.round(screenSize.height * this._viewport.y);
		this._viewportInPixel.width = Math.round(screenSize.width * this._viewport.width);
		this._viewportInPixel.height = Math.round(screenSize.height * this._viewport.height);
		return this._viewportInPixel;
	}

	setFitStrategy(strategy)
	{
		this._fitStrategy = strategy;
		this._doRequireRefresh();
	}

	getFitStrategy()
	{
		return this._fitStrategy; 
	}

	apply(matrix)
	{
		if(this._matrix === null || matrix === null || ! this._matrix.equals(matrix)) {
			this._matrix = matrix;
			if(this._matrix) {
				this._invertedMatrix.assignFrom(this._matrix);
				this._invertedMatrix.invert();
			}
		}
		this._doRefresh();
	}
	
	getMatrix()
	{
		return this._matrix;
	}

	getInvertedMatrix()
	{
		return this._invertedMatrix;
	}

	mapScreenToWorld(point)
	{
		if(! this._matrix) {
			return point;
		}

		const pt = this._matrix.transformPoint(point, Camera._cachedPoint);
//console.log(point.toString() + ' --- ' + pt.toString());
		return pt;
	}

	_doRequireRefresh()
	{
		this._cachedScreenSize.width = -1;
	}

	_doRefresh()
	{
		if(! this._cachedScreenSize.equals(Application.getInstance().getScreenSize())) {
			this._cachedScreenSize.assignFrom(Application.getInstance().getScreenSize());

			switch(this._fitStrategy) {
			case Camera.fitStrategies.none:
				break;
				
			case Camera.fitStrategies.scaleFitFullScreen: {
				const cachedRatio = this._cachedScreenSize.width / this._cachedScreenSize.height;
				const targetRatio = this._targetViewSize.width / this._targetViewSize.height;
				if(cachedRatio >= targetRatio) {
					this._viewport.width = targetRatio / cachedRatio;
					this._viewport.height = 1;
				}
				else {
					this._viewport.width = 1;
					this._viewport.height = cachedRatio / targetRatio;
				}
				this._viewport.x = (1.0 - this._viewport.width) / 2.0;
				this._viewport.y = (1.0 - this._viewport.height) / 2.0;
			}
				break;
				
			case Camera.fitStrategies.fixed:
				this._viewport.width = this._targetViewSize.width / this._cachedScreenSize.width;
				this._viewport.height = this._targetViewSize.height / this._cachedScreenSize.height;
				break;
			}
		}
	}

}

Camera._cachedPoint = new Point();

Camera.fitStrategies = {
	none: 'none',
	scaleFitFullScreen: 'scaleFitFullScreen', // keep the ascpect ratio as targetViewSize
	fixed: 'fixed', // use targetViewSize
};

export { Camera };
