import jQuery from 'jquery';
import { EventDispatcher } from '../EventDispatcher';
import { Util } from '../util/Util';

class NetLoader extends EventDispatcher
{
	static setExtraHeaders(extraHeaders)
	{
		this._extraHeaders = extraHeaders;
	}
	
	static createRequestData(method, url, params)
	{
		return {
			method: method,
			url: url,
			params: params
		};
	}
	
	constructor(requestData)
	{
		super();

		this._state = NetLoader.states.unstarted;

		this._requestData = requestData || {};
		this._requestData.method = this._requestData.method || NetLoader.methods.get;
		this._requestData.url = this._requestData.url || null;
		this._requestData.params = this._requestData.params || null;
		this._requestData.dataType = this._requestData.dataType || 'json';
		this._requestData.retryCount = this._requestData.retryCount || 0;

		this._jqxhr = null;
		this._responseData = null;
		this._statusCode = 0;
		this._error = false;
		
		this._uniqueId = Util.generateUniqueId('NetLoader');
		
		this._loaderQueue = null;
	}
	
	getState() { return this._state; }
	getMethod() { return this._requestData.method; }
	getUrl() { return this._requestData.url; }
	getParams() { return this._requestData.params; }

	getRequestData() { return this._requestData; }
	getResponseData() { return this._responseData; }
	getStatusCode() { return this._statusCode; }
	hasError() { return this._error; }
	
	getUniqueId() { return this._uniqueId; }
	
	isUnstarted() { return this.getState() === NetLoader.states.unstarted; }
	isLoading() { return this.getState() === NetLoader.states.loading; }
	isLoaded() { return this.getState() === NetLoader.states.loaded; }
	
	send()
	{
		this._statusCode = 0;
		this._error = false;
		this._state = NetLoader.states.loading;
//console.log("NetLoader: Sending " + this._requestData.method + "  " + this._requestData.url);
		this._jqxhr = jQuery.ajax({
			url: Util.formatString(this._requestData.url, this._requestData.params),
			type: this._requestData.method,
			data: this._requestData.params,
			dataType: this._requestData.dataType,
			timeout: 1000 * 30,
			headers: NetLoader._extraHeaders,
			success: (responseData) => {
				this._doOnSuccess(responseData);
			},
			error: (jqXHR, textStatus, errorThrown) => {
				this._doOnError(jqXHR, textStatus, errorThrown);
			},
		});
	}
	
	abort()
	{
		if(this._jqxhr) {
			this._jqxhr.abort();
			this._jqxhr = null;
		}
		
		let queue = this._loaderQueue;
		this._loaderQueue = null;
		if(queue) {
			queue._doOnLoaderCanceled(this);
		}
	}
	
	_doOnSuccess(responseData)
	{
		this._state = NetLoader.states.loaded;
		this._responseData = responseData;
		
		this._doLoaded();
	}

	_doOnError(jqXHR, /*textStatus, errorThrown*/)
	{
		if(this._requestData.retryCount > 0) {
//console.log("NetLoader: Retrying... " + textStatus + "  " + errorThrown);
			this._requestData.retryCount -= 1;
			this.send();
			return;
		}
		
		this._error = true;
		this._statusCode = (jqXHR ? jqXHR.status : 400);
				
		this._state = NetLoader.states.loaded;
		this._responseData = null;

		this._doLoaded();
	}
	
	_doLoaded()
	{
		this._jqxhr = null;
		
		let queue = this._loaderQueue;
		this._loaderQueue = null;
		if(queue) {
			queue._doOnLoaderFinish(this);
		}
		
		this.dispatchEvent(NetLoader.events.loaded, this, this._responseData);
	}

}

NetLoader.methods = {
	get: 'GET',
	post: 'POST',
	put: 'PUT',
	patch: 'PATCH',
	'delete': 'DELETE'
};

NetLoader.events = {
	loaded: 'loaded'
};

NetLoader.errors = {
	error: 0,
	timeout: 1
};

NetLoader.states = {
	unstarted: 0,
	loading: 1,
	loaded: 2
};

NetLoader._extraHeaders = {};

export { NetLoader };
