import { EventDispatcher } from './EventDispatcher.js';
import { CircularQueue } from './CircularQueue.js';

class EventQueue extends EventDispatcher
{
	constructor()
	{
		super();
		
		this._eventQueue = new CircularQueue();
	}

	send()
	{
		this._doDispatch(arguments);
	}
	
	post()
	{
		this._eventQueue.enqueue(arguments);
	}
	
	process()
	{
		while(! this._eventQueue.isEmpty()) {
			this._doDispatch(this._eventQueue.dequeue());
		}
	}

	_doDispatch(args)
	{
		if(! args) {
			return;
		}

		this.dispatchEvent.apply(this, args);
	}

}

export { EventQueue };
