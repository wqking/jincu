import { Component } from './Component.js';
import { TweenList } from '../tween/TweenList.js';
import { Accessor } from '../accessor/Accessor.js';

class ComponentAnimation extends Component
{
	constructor()
	{
		super(Component.types.animation);
	}

	setAnimation(name)
	{
		this.doSetAnimation(name);
	}

	// abstract
	//doSetAnimation(name);

}

export { ComponentAnimation };


class ComponentFrameAnimation extends ComponentAnimation
{
	constructor(animationSetData)
	{
		super();
		
		this._currentAnimation = null;
		this._tween = null;
		
		this.doSetRatio = this.doSetRatio.bind(this);

		this.setAnimationSetData(animationSetData);
	}
	
	setAnimationSetData(animationSetData)
	{
		this._animationSetData = animationSetData;
		if(this._animationSetData && this._animationSetData.getAnimationCount() > 0) {
			this.setAnimation(this._animationSetData.getAnimationNameAt(0));
		}
	}
	
	getTween()
	{
		return this._tween;
	}

	// override
	doSetAnimation(name)
	{
		this._currentAnimation = this._animationSetData.getAnimationData(name);
		if(this._currentAnimation !== null) {
			this.doRestartTween();
		}
		else {
			this.doRemoveTween();
		}
	}

	doRemoveTween()
	{
		if(this._tween !== null) {
			TweenList.getInstance().remove(this._tween);
			this._tween = null;
		}
	}

	doRestartTween()
	{
		this.doRemoveTween();
		
		this._tween = TweenList.getInstance().tween();

		this._tween.useFrames(false);
		this._tween.target(Accessor.create(null, this.doSetRatio), 0.0, 1.0);
		this._tween.duration(this._currentAnimation.getDurationMilliseconds());
	}

	doSetRatio(ratio)
	{
		if(this._currentAnimation !== null) {
			const frameIndexList = this._currentAnimation.getFrameIndexList();
			const frameCount = frameIndexList.length;
			const index = Math.round(frameCount * ratio);
			if(index < frameCount) {
				const render = this.getEntity().getComponent(Component.types.render);
				render.getRender().setIndex(index);
			}
		}
	}

}

export { ComponentFrameAnimation };
