import { Tweenable } from './Tweenable.js';
import { LinearEase } from './TweenEases.js';
import { Accessor } from '../accessor/Accessor.js';

class TweenItemTarget
{
	constructor(accessor, fromValue, toValue)
	{
		this._accessor = Accessor.create(accessor, accessor);
		this._from = fromValue;
		this._to = toValue;
		this._change = 0;
	}
	
	init()
	{
		if(this._from === undefined) {
			this._from = this._accessor.get();
		}
		
		this._change = this._to - this._from;
	}
	
	tick(param, ease)
	{
		const ratio = ease(param);
		const value = this._from + (this._change * ratio);
		this._accessor.set(value);
	}

}

class TweenItemRelative
{
	constructor(accessor, fromValue, relativeValue)
	{
		this._accessor = Accessor.create(accessor, accessor);
		this._from = fromValue;
		this._change = relativeValue;
	}
	
	init()
	{
		if(this._from === undefined) {
			this._from = this._accessor.get();
		}
	}
	
	tick(param, ease)
	{
		const ratio = ease(param);
		const value = this._from + (this._change * ratio);
		this._accessor.set(value);
	}

}

class TweenItemFollow
{
	constructor(accessor, fromValue, toGetter)
	{
		this._accessor = Accessor.create(accessor, accessor);
		this._from = fromValue;
		this._toGetter = toGetter;
	}
	
	init()
	{
		if(this._from === undefined) {
			this._from = this._accessor.get();
		}
	}
	
	tick(param, ease)
	{
		const ratio = ease(param);
		const value = this._from + ((this._toGetter.get() - this._from) * ratio);
		this._accessor.set(value);
	}

}

class Tween extends Tweenable
{
	constructor()
	{
		super();
		
		this._easeCallback = LinearEase.ease();
		this._durationTime = 0;

		this._itemList = [];
	}
	
	target()
	{
		let item = null;
		if(arguments.length >= 3) {
			item = new TweenItemTarget(arguments[0], arguments[1], arguments[2]);
		}
		else {
			item = new TweenItemTarget(arguments[0], undefined, arguments[1]);
		}
		this._itemList.push(item);

		return this;
	}

	relative()
	{
		let item = null;
		if(arguments.length >= 3) {
			item = new TweenItemRelative(arguments[0], arguments[1], arguments[2]);
		}
		else {
			item = new TweenItemRelative(arguments[0], undefined, arguments[1]);
		}
		this._itemList.push(item);

		return this;
	}

	follow()
	{
		let item = null;
		if(arguments.length >= 3) {
			item = new TweenItemFollow(arguments[0], arguments[1], arguments[2]);
		}
		else {
			item = new TweenItemFollow(arguments[0], undefined, arguments[1]);
		}
		this._itemList.push(item);

		return this;
	}

	ease(ease)
	{
		this._easeCallback = ease;
		if(! this._easeCallback) {
			this._easeCallback = LinearEase.ease();
		}
		return this;
	}

	duration(durationTime)
	{
		this._durationTime = durationTime;
		return this;
	}

	// override
	getDuration()
	{
		return this._durationTime;
	}

	// override
	doPerformTime(elapsed, frameDuration, forceReversed, /*forceUseFrames*/)
	{
		let shouldFinish = false;
		let shouldSetValue = true;
		let t = elapsed;

		if(this._repeatCount === 0) {
			if(t >= this._durationTime) {
				shouldFinish = true;
				t = this._durationTime;
			}
		}
		else {
			let cycleDuration = this._durationTime + this._repeatDelayTime;
			if(cycleDuration > 0) {
				let times = Math.floor(t / cycleDuration);
				let ctimes = times;
				let remains = t - times * cycleDuration;
				if(remains > this._durationTime) {
					t = this._durationTime;
				}
				else {
					if(remains <= 0) {
						--times;
						t = this._durationTime;
					}
					else {
						t = remains;
					}
					if(times > this._cycleCount) {
						this._cycleCount = times;
						if(this._repeatCount < 0) {
						}
						else {
							if(ctimes > this._repeatCount) {
								shouldFinish = true;
								shouldSetValue = false;
							}
						}
						if(this.isYoyo()) {
							this.doToggleBackward();
						}
						
						if(this._callbackOnRepeat) {
							this._callbackOnRepeat();
						}
					}
				}
			}
			else {
				shouldSetValue = false;
				shouldFinish = true;
			}
		}

		if(forceReversed || this.isBackward()) {
			t = this._durationTime - t;
		}

		if(shouldSetValue && t != this._previousAppliedTime) {
			this._previousAppliedTime = t;

			Tween._cachedParam.current = t;
			Tween._cachedParam.total = this._durationTime;
			if(! this._durationTime) {
				Tween._cachedParam.current = 1.0;
				Tween._cachedParam.total = 1.0;
			}
			for(let item of this._itemList) {
				item.tick(Tween._cachedParam, this._easeCallback);
			}
			
			if(this._callbackOnUpdate) {
				this._callbackOnUpdate();
			}
		}
		
		if(shouldFinish) {
			this.doComplete(true);
		}
	}
	
	// override
	doInitialize()
	{
		for(let item of this._itemList) {
			item.init();
		}
	}

}

Tween._cachedParam = {
	current: 0,
	total: 0
};


export { Tween };
