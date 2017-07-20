import { EventDispatcher } from '../EventDispatcher';
import { Util } from '../util/Util';

class NetLoaderQueue extends EventDispatcher
{
	static getInstance()
	{
		return NetLoaderQueue._instance;
	}
	
	constructor()
	{
		super();

		this._maxLivingCount = 15;
		this._pendingQueue = [];
		this._livingQueue = [];
		
		this._doOnLoaderFinish = this._doOnLoaderFinish.bind(this);
	}

	setMaxLivingCount(maxLivingCount)
	{
		this._maxLivingCount = maxLivingCount;
	}
	
	append(loader)
	{
		if(! this.hasLoader(loader)) {
			loader.addListenerOnce(this._doOnLoaderFinish);
			loader._loaderQueue = this;
			this._pendingQueue.push(loader);
			this._doCheckLoadMore();
		}
	}
	
	removePendingLoader(loader)
	{
		Util.removeItemFromArray(this._pendingQueue, loader);
	}
	
	hasLoader(loader)
	{
		return this._pendingQueue.indexOf(loader) >= 0 || this._livingQueue.indexOf(loader) >= 0;
	}

	_doCheckLoadMore()
	{
		while(this._livingQueue.length < this._maxLivingCount && this._pendingQueue.length > 0) {
			let loader = this._pendingQueue.shift();

			loader.addForwarder(this);

			this._livingQueue.push(loader);

			loader.send();
		}
	}

	_doOnLoaderFinish(loader)
	{
		this._doClearLoader(loader);
	}

	_doClearLoader(loader)
	{
		loader.removeForwarder(this);
		
		Util.removeItemFromArray(this._livingQueue, loader);
		this._doCheckLoadMore();
	}
	
}

NetLoaderQueue._instance = new NetLoaderQueue();

export { NetLoaderQueue };
