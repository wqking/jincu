import { TweenList } from './TweenList.js';

class Timeline extends TweenList
{
	constructor()
	{
		super();

		this._invalidDurationTime();
	}
	
	getDuration()
	{
		if(this._durationTime < 0) {
			this._durationTime = 0;
			for(let item of this._tweenList) {
				if(item.hasAddedToTimeline()) {
					const t = item._startTime + item._tweenable.getTotalDuration() + item._tweenable.getDelay();
					if(t > this._durationTime) {
						this._durationTime = t;
					}
				}
			}
		}

		return this._durationTime;
	}

	append(tweenable)
	{
		let duration = 0;
		let data = null;
		for(let item of this._tweenList) {
			if(item._tweenable === tweenable) {
				data = item;
			}
			else {
				if(item.hasAddedToTimeline()) {
					const t = item._startTime + item._tweenable.getTotalDuration() + item._tweenable.getDelay();
					if(t > duration) {
						duration = t;
					}
				}
			}
		}

		if(data === null) {
			return -1;
		}

		data._startTime = duration;
		data.addToTimeline();

		this._invalidDurationTime();

		return duration;
	}

	prepend(tweenable)
	{
		let data = null;
		for(let item of this._tweenList) {
			if(item._tweenable === tweenable) {
				data = item;
				break;
			}
		}

		if(data === null) {
			return;
		}

		const duration = tweenable.getTotalDuration() + tweenable.getDelay();
		for(let item of this._tweenList) {
			if(item._tweenable !== tweenable && item.hasAddedToTimeline()) {
				item._startTime += duration;
			}
		}

		data._startTime = 0;
		data.addToTimeline();

		this._invalidDurationTime();
	}

	insert(time, tweenable)
	{
		let data = null;
		for(let item of this._tweenList) {
			if(item._tweenable === tweenable) {
				data = item;
				break;
			}
		}

		if(data === null) {
			return;
		}

		let minStartTime = -1.0;
		for(let item of this._tweenList) {
			if(item._tweenable !== tweenable && item.hasAddedToTimeline()) {
				if(item._startTime >= time) {
					if(minStartTime < 0 || item._startTime < minStartTime) {
						minStartTime = item._startTime;
					}
				}
			}
		}
		if(minStartTime >= 0) {
			const duration = tweenable.getTotalDuration() + tweenable.getDelay();
			const deltaTime = duration - (minStartTime - time);
			for(let item of this._tweenList) {
				if(item._tweenable !== tweenable && item.hasAddedToTimeline()) {
					if(item._startTime >= time) {
						item._startTime += deltaTime;
					}
				}
			}
		}

		data._startTime = time;
		data.addToTimeline();

		this._invalidDurationTime();
	}

	setAt(time, tweenable)
	{
		for(let item of this._tweenList) {
			if(item._tweenable === tweenable) {
				item._startTime = time;
				item.addToTimeline();
				this._invalidDurationTime();
				return;
			}
		}
	}

	getStartTime(tweenable)
	{
		for(let item of this._tweenList) {
			if(item._tweenable === tweenable) {
				return item._startTime;
			}
		}

		return 0;
	}

	doPerformTime(elapsed, frameDuration, forceReversed, forceUseFrames)
	{
		this.getDuration();

		let shouldFinish = false;
		let shouldSetValue = true;
		let shouldRestart = false;
		let t = elapsed;

		if(this._repeatCount == 0) {
			if(t >= this._durationTime) {
				shouldFinish = true;
				t = this._durationTime;
			}
		}
		else {
			const cycleDuration = this._durationTime + this._repeatDelayTime;
			if(cycleDuration > 0) {
				let times = Math.floor(t / cycleDuration);
				let ctimes = times;
				t -= times * cycleDuration;
				if(t > this._durationTime) {
					t = this._durationTime;
				}
				else {
					if(times > this._cycleCount) {
						this._cycleCount = times;
						shouldRestart = true;
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

		const reversed = forceReversed || this.isBackward();
		if(reversed) {
			t = this._durationTime - t;
		}

		if(shouldSetValue && t !== this._previousAppliedTime) {
			this._previousAppliedTime = t;

			const useFrames = forceUseFrames || this.isUseFrames();
			if(useFrames && frameDuration > 0) {
				frameDuration = 1.0;
			}
			for(let item of this._tweenList) {
				if(shouldRestart) {
					item._tweenable.restart();
				}
				if((!reversed && t >= item._startTime)
					|| (reversed && t >= item._startTime && t <= item._startTime + item._tweenable.getTotalDuration() + item._tweenable.getDelay())
				) {
					if(reversed) {
						item._tweenable.elapsedTime = (item._startTime + item._tweenable.getTotalDuration() + item._tweenable.getDelay() - t) - frameDuration;
					}
					else {
						item._tweenable.elapsedTime = t - item._startTime - frameDuration;
					}
					item._tweenable.doTick(frameDuration, reversed, useFrames);
				}
			}
			if(shouldRestart) {
				this.immediateTick();
			}
			
			if(this._callbackOnUpdate) {
				this._callbackOnUpdate();
			}
		}
		
		if(shouldFinish) {
			this.doComplete(true);
		}
	}

	_invalidDurationTime()
	{
		this._durationTime = -1;
	}
}

export { Timeline };

TweenList.TimelineClass = Timeline;
