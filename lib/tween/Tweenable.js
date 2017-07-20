import { Flags } from '../Flags.js';

const invalidPreviousAppliedTime = -1.0;
export const tweenRepeatInfinitely = -1;
export const tweenNoRepeat = 0;

class Tweenable
{
	constructor()
	{
		this._flags = new Flags();
		this._elapsedTime = 0;
		this._delayTime =0;
		this._repeatDelayTime = 0;
		this._repeatCount = 0;
		this._cycleCount = 0
		this._timeScaleTime = 1.0;
		this._previousAppliedTime = invalidPreviousAppliedTime;
		
		// We use plain callback function instead of EventDispatch to reduce performance hit
		this._callbackOnInitialize = null;
		this._callbackOnComplete = null;
		this._callbackOnDestroy = null;
		this._callbackOnUpdate = null;
		this._callbackOnRepeat = null;
	}

	// abstract
	//getDuration();
	
	getTotalDuration()
	{
		if(this._repeatCount >= 0) {
			return this.getDuration() * (this._repeatCount + 1) + this._repeatDelayTime * this._repeatCount;
		}
		else {
			return this.getDuration() * 99999999.0 + this._repeatDelayTime * (99999999.0 - 1.0);
		}
	}
	
	getCurrentTime()
	{
		if(this._elapsedTime <= this._delayTime) {
			return 0.0;
		}
		
		if(this._cycleCount > 0) {
			return this._elapsedTime - this._delayTime - ((this.getDuration() + this._repeatDelayTime) * this._cycleCount);
		}
		else {
			return this._elapsedTime - this._delayTime;
		}
	}

	setCurrentTime(value)
	{
		if(value < 0.0) {
			value = 0.0;
		}
		const d = this.getDuration();
		if(value > d) {
			value = d;
		}
		if(this._cycleCount > 0) {
			value += (d + this._repeatDelayTime) * this._cycleCount;
		}
		this._elapsedTime = Math.min(value, this.getTotalDuration()) + this.delayTime;
		
		this.doRestartChildren();
	}

	getTotalTime()
	{
		return this._elapsedTime - this._delayTime;
	}

	setTotalTime(value)
	{
		if(value < 0.0) {
			value = 0.0;
		}
		this._elapsedTime = Math.min(value, this.getTotalDuration()) + this._delayTime;

		const cycleDuration = this.getDuration() + this._repeatDelayTime;
		if(cycleDuration > 0) {
			this._cycleCount = Math.floor(this._elapsedTime / cycleDuration);
		}
		else {
			this._cycleCount = 0;
		}
		
		this.doRestartChildren();
	}

	getCurrentProgress()
	{
		const d = this.getDuration();
		if(d <= 0.0) {
			return 0.0;
		}
		return this.getCurrentTime() / d;
	}

	setCurrentProgress(value)
	{
		this.setCurrentTime(value * this.getDuration());
	}

	getTotalProgress()
	{
		const d = this.getTotalDuration();
		if(d <= 0.0) {
			return 0.0;
		}
		return this.getTotalTime() / d;
	}

	setTotalProgress(value)
	{
		this.setTotalTime(value * this.getTotalDuration());
	}

	restart()
	{
		this._elapsedTime = this._delayTime;
		this._previousAppliedTime = invalidPreviousAppliedTime;
		this._cycleCount = 0;
		this._flags.clear(Tweenable.flags.completed);
		
		this.doRestartChildren();
	}

	restartWithDelay()
	{
		this._elapsedTime = 0;
		this._previousAppliedTime = invalidPreviousAppliedTime;
		this._cycleCount = 0;
		this._flags.clear(Tweenable.flags.completed);
		
		this.doRestartChildrenWithDelay();
	}

	pause()
	{
		this._flags.set(Tweenable.flags.paused);
	}

	resume()
	{
		this._flags.clear(Tweenable.flags.paused);
	}

	immediateTick()
	{
		const paused = this.isPaused();
		this._flags.clear(Tweenable.flags.paused);

		this.doTick(0, this.isBackward(), false);

		this._flags.setByBool(Tweenable.flags.paused, paused);
	}

	tick(frameDuration)
	{
		this.doTick(this.isUseFrames() ? 1.0 : frameDuration, false, false);
	}

	backward(value)
	{
		this._flags.setByBool(Tweenable.flags.backward, value);
		return this;
	}

	useFrames(value)
	{
		this._flags.setByBool(Tweenable.flags.useFrames, value);
		return this;
	}

	delay(value)
	{
		this._delayTime = value;
		return this;
	}

	timeScale(value)
	{
		this._timeScaleTime = value;
		return this;
	}

	repeat(repeatCount)
	{
		this._repeatCount = repeatCount;
		return this;
	}

	repeatDelay(value)
	{
		this._repeatDelayTime = value;
		return this;
	}

	yoyo(value)
	{
		this._flags.setByBool(Tweenable.flags.reverseWhenRepeat, value);
		return this;
	}

	onInitialize(value)
	{
		this._callbackOnInitialize = value;
		return this;
	}

	onComplete(value)
	{
		this._callbackOnComplete = value;
		return this;
	}

	onDestroy(value)
	{
		this._callbackOnDestroy = value;
		return this;
	}

	onUpdate(value)
	{
		this._callbackOnUpdate = value;
		return this;
	}

	onRepeat(value)
	{
		this._callbackOnRepeat = value;
		return this;
	}

	isRunning()
	{
		return this._flags.has(Tweenable.flags.initialized) && ! this._flags.has(Tweenable.flags.paused);
	}
	
	isPaused()
	{
		return this._flags.has(Tweenable.flags.paused);
	}

	isCompleted()
	{
		return this._flags.has(Tweenable.flags.completed);
	}

	isUseFrames()
	{
		return this._flags.has(Tweenable.flags.useFrames);
	}

	isBackward()
	{
		return this._flags.has(Tweenable.flags.backward);
	}

	isYoyo()
	{
		return this._flags.has(Tweenable.flags.reverseWhenRepeat);
	}
	
	isRepeat()
	{
		return this._repeatCount !== tweenNoRepeat;
	}
	
	isRepeatInfinitely()
	{
		return this._repeatCount < 0;
	}
	
	getRepeatCount()
	{
		return this._repeatCount;
	}

	getRepeatDelay()
	{
		return this._repeatDelayTime;
	}

	getDelay()
	{
		return this._delayTime;
	}

	getTimeScale()
	{
		return this._timeScaleTime;
	}

	doTick(frameDuration, forceReversed, forceUseFrames)
	{
		if(this.isCompleted()) {
			return;
		}

		if(this.isPaused()) {
			return;
		}

		let d = 0.0;
		if(frameDuration > 0) {
			frameDuration *= this._timeScaleTime;
			this._elapsedTime += frameDuration;
			if(this._elapsedTime <= this._delayTime) {
				return;
			}

			if(this._repeatCount >= 0) {
				const total = this.getTotalDuration();
				if(this._elapsedTime > total + this._delayTime) {
					this._elapsedTime = total + this._delayTime;
				}
			}

			d = this._elapsedTime - this._delayTime;
		}
		else {
			if(this._elapsedTime > this._delayTime) {
				d = this._elapsedTime - this._delayTime;
			}
		}

		if(! this._flags.has(Tweenable.flags.initialized)) {
			this._flags.set(Tweenable.flags.initialized);

			if(this._callbackOnInitialize) {
				this._callbackOnInitialize();
			}

			this.doInitialize();
		}

		this.doPerformTime(d, frameDuration, forceReversed, forceUseFrames);
	}

	doComplete(emitEvent)
	{
		if(this.isCompleted()) {
			return;
		}

		this._flags.set(Tweenable.flags.completed);
		this._elapsedTime = this.getTotalDuration() + this._delayTime;

		if(emitEvent && this._callbackOnComplete) {
			this._callbackOnComplete();
		}
	}

	// abstract
	//doPerformTime(elapsed, frameDuration, forceReversed, forceUseFrames);
	
	doRestartChildren()
	{
	}

	doRestartChildrenWithDelay()
	{
	}

	doInitialize()
	{
	}

	doToggleBackward()
	{
		this._flags.toggle(Tweenable.flags.backward);
	}

}

Tweenable.flags = {
	initialized: 1 << 0,
	paused: 1 << 1,
	completed: 1 << 2,
	useFrames: 1 << 3,
	backward: 1 << 4,
	reverseWhenRepeat: 1 << 5,
};

export { Tweenable }

