import { Util } from './util/Util';

var EventEmitter = require('wolfy87-eventemitter');

class EventDispatcher
{
	constructor()
	{
		this._eventEmitter = new EventEmitter();
		this._forwarderList = [];
	}

	addListener(e, listener)
	{
		if(listener) {
			this._eventEmitter.removeListener(e, listener);
			this._eventEmitter.addListener(e, listener);
		}
		
		return this;
	}

	addListenerOnce(e, listener)
	{
		if(listener) {
			this._eventEmitter.removeListener(e, listener);
			this._eventEmitter.addOnceListener(e, listener);
		}
		
		return this;
	}

	removeListener(e, listener)
	{
		this._eventEmitter.removeListener(e, listener);
		
		return this;
	}
	
	removeAllListeners(e)
	{
		this._eventEmitter.removeListeners(e);
	}
	
	hasListener(e, listener)
	{
		let listenerList = this._eventEmitter.getListeners(e);
		for(let i of listenerList) {
			if(i.listener === listener) {
				return true;
			}
		}
		
		return false;
	}
	
	addForwarder(forwarder)
	{
		if(forwarder && this._forwarderList.indexOf(forwarder) < 0) {
			this._forwarderList.push(forwarder);
		}
	}

	removeForwarder(forwarder)
	{
		Util.removeItemFromArray(this._forwarderList, forwarder);
	}

	dispatchEvent(e)
	{
        //let args = Array.prototype.slice.call(arguments, 1);
		this._eventEmitter.emitEvent.call(this._eventEmitter, e, arguments);
		
		for(let forwarder of this._forwarderList) {
			forwarder._eventEmitter.emitEvent.call(forwarder._eventEmitter, e, arguments);
		}
		
		return this;
	}
	
}

export { EventDispatcher };
