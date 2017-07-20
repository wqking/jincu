import { Transition } from './Transition.js';
import { Point, Rect } from '../Geometry.js';
import { Accessor } from '../accessor/Accessor.js';
import { Camera } from '../Camera.js';

class CameraComponentSaver
{
	constructor(camera)
	{
		this._camera = camera;
		this._viewport = camera.getViewport().clone();
		this._fitStrategy = camera.getFitStrategy();
	}
	
	restore() {
		this._camera.setViewport(this._viewport);
		this._camera.setFitStrategy(this._fitStrategy);
	}
}

class TransitionMoveIn extends Transition
{
	constructor(durationMilliseconds, direction)
	{
		super();
		
		this._durationMilliseconds = durationMilliseconds || 500;
		this._direction = direction || new Point(1, 0);
		this._fromSaver = null;
		this._toSaver = null;
		
		this.doSetRatio = this.doSetRatio.bind(this);
	}

	doFinalize()
	{
		if(this._fromSaver) {
			this._fromSaver.restore();
		}
		if(this._toSaver) {
			this._toSaver.restore();
		}
	}

	doTransite(fromScene, toScene)
	{
		const fromCameraComponent = fromScene.getPrimaryCamera();
		const toCameraComponent = toScene.getPrimaryCamera();
		this._fromSaver = new CameraComponentSaver(fromCameraComponent);
		this._toSaver = new CameraComponentSaver(toCameraComponent);

		fromCameraComponent.setFitStrategy(Camera.fitStrategies.none);
		toCameraComponent.setFitStrategy(Camera.fitStrategies.none);
		
		this.doSetRatio(0);
		
		this.getTween()
			.duration(this._durationMilliseconds)
			.target(Accessor.create(null, this.doSetRatio), 0.0, 1.0)
			.onComplete(this.finish.bind(this))
		;
	}

	doSetRatio(ratio)
	{
		const fromSourceX = this._fromSaver._viewport.x;
		const fromSourceY = this._fromSaver._viewport.y;
		const fromTargetX = this._fromSaver._viewport.x + this._fromSaver._viewport.width * this._direction.x;
		const fromTargetY = this._fromSaver._viewport.y + this._fromSaver._viewport.height * this._direction.y;
		const toSourceX = this._fromSaver._viewport.x - this._toSaver._viewport.width * this._direction.x;
		const toSourceY = this._fromSaver._viewport.y - this._toSaver._viewport.height * this._direction.y;
		const toTargetX = this._toSaver._viewport.x;
		const toTargetY = this._toSaver._viewport.y;
		
		TransitionMoveIn._cachedRect.x = fromSourceX + (fromTargetX - fromSourceX) * ratio;
		TransitionMoveIn._cachedRect.y = fromSourceY + (fromTargetY - fromSourceY) * ratio
		TransitionMoveIn._cachedRect.width = this._fromSaver._viewport.width;
		TransitionMoveIn._cachedRect.height = this._fromSaver._viewport.height;
		this._fromSaver._camera.setViewport(TransitionMoveIn._cachedRect);

		TransitionMoveIn._cachedRect.x = toSourceX + (toTargetX - toSourceX) * ratio;
		TransitionMoveIn._cachedRect.y = toSourceY + (toTargetY - toSourceY) * ratio;
		TransitionMoveIn._cachedRect.width = this._toSaver._viewport.width;
		TransitionMoveIn._cachedRect.height = this._toSaver._viewport.height;
		this._toSaver._camera.setViewport(TransitionMoveIn._cachedRect);
	}

}

TransitionMoveIn._cachedRect = new Rect();

export { TransitionMoveIn };
