import { TweenList } from '../tween/TweenList.js';
import { EventDispatcher } from '../EventDispatcher.js';

class Transition extends EventDispatcher
{
	constructor()
	{
		super();

		this._tween = null;
	}
	
	getTween()
	{
		if(! this._tween) {
			this._tween = TweenList.getInstance().tween();
		}
		
		return this._tween;
	}
	
	transite(fromScene, toScene)
	{
		this.doTransite(fromScene, toScene);
	}
	
	// abstract
	//doTransite(fromScene, toScene);

	finish()
	{
		if(this._tween) {
			TweenList.getInstance().remove(this._tween);
		}
		this._tween = null;

		this.doFinalize();

		this.dispatchEvent(Transition.events.finished, this);
	}

	doFinalize()
	{
	}

}

Transition.events = {
	finished: 'finished'
};

export { Transition };
