import { Tweenable } from './Tweenable.js';
import { Tween } from './Tween.js';

class TweenableData
{
	constructor(isTimeline)
	{
		this._isTimeline = isTimeline;
		this._hasAddedToTimeline = false;
		
		this._startTime = 0;
		this.tweenable = null;
	}
	
	isTimeline()
	{
		return this._isTimeline;
	}
	
	hasAddedToTimeline()
	{
		return this._hasAddedToTimeline;
	}

	addToTimeline()
	{
		this._hasAddedToTimeline = true;
	}
}

class TweenList extends Tweenable
{
	static getInstance()
	{
		if(! TweenList._instance) {
			TweenList._instance = new TweenList();
		}
		
		return TweenList._instance;
	}

	constructor()
	{
		super();
		
		this._tweenList = [];
	}

	tween()
	{
		const tweenable = new Tween();
		tweenable.useFrames(this.isUseFrames());
		
		const data = new TweenableData(false);
		data._tweenable = tweenable;
		
		this._tweenList.push(data);
		return tweenable;
	}
	
	timeline()
	{
		// TimelineClass is assigned from Timeline.js, to avoid circular import.
		const tweenable = new TweenList.TimelineClass();
		tweenable.useFrames(this.isUseFrames());
		
		const data = new TweenableData(false);
		data._tweenable = tweenable;
		
		this._tweenList.push(data);
		return tweenable;
	}
	
	remove(tweenable)
	{
		for(let i = this._tweenList.length - 1; i >= 0; --i) {
			if(this._tweenList[i]._tweenable === tweenable) {
				this._tweenList[i] = null;
				break;
			}
		}
	}
	
	clear()
	{
		this._tweenList = [];
	}
	
	getTweenableCount()
	{
		let count = 0;
		for(let tweenable of this._tweenList) {
			if(tweenable !== null) {
				++count;
			}
		}
		return count;
	}
	
	// override
	getDuration()
	{
		return 0;
	}
	
	// override
	doPerformTime(elapsed, frameDuration, /*forceReversed, forceUseFrames*/)
	{
		let count = this._tweenList.length;
		for(let i = 0; i < count; ++i) {
			const data = this._tweenList[i];
			let shouldRemove = false;
			if(data === null) {
				shouldRemove = true;
			}
			else {
				const tweenable = data._tweenable;
				tweenable.tick(frameDuration);
				if(tweenable.isCompleted()) {
					shouldRemove = true;
				}
			}
			if(shouldRemove) {
				this._tweenList.splice(i, 1);
				--count;
				--i;
			}
		}
	}

	// override
	doRestartChildren()
	{
		for(let data of this._tweenList) {
			if(data !== null) {
				data._tweenable.restart();
			}
		}
	}

	// override
	doRestartChildrenWithDelay()
	{
		for(let data of this._tweenList) {
			if(data !== null) {
				data._tweenable.restartWithDelay();
			}
		}
	}

}

export { TweenList };
