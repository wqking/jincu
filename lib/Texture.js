import { Size } from './Geometry.js';
import { EventDispatcher } from './EventDispatcher.js';

class Texture extends EventDispatcher
{
	constructor(source)
	{
		super();

		this._source = source;
		this._size = new Size();
		this._image = new Image();
		this._loaded = false;

		this._doOnLoaded = this._doOnLoaded.bind(this);
		this._doOnError = this._doOnError.bind(this);
		this._image.addEventListener('load', this._doOnLoaded, false);
		this._image.addEventListener('error', this._doOnError, false);
	}
	
	load(source)
	{
		if(source && this._source !== source) {
			this._source = source;
			this._loaded = false;
		}
		
		if(! this._loaded) {
			if(this._source) {
				this._image.src = this._source;
			}
		}
		else {
			this._doOnLoaded();
		}
	}
	
	getSize()
	{
		return this._size;
	}
	
	getWidth()
	{
		return this._size.width;
	}
	
	getHeight()
	{
		return this._size.height;
	}
	
	getHtmlImage()
	{
		return this._image;
	}
	
	didLoad()
	{
		return this._loaded;
	}
	
	isValid()
	{
		return !! this._source;
	}

	_doOnLoaded()
	{
		this._loaded = true;

		this._size.width = this._image.width;
		this._size.height = this._image.height;

		this.dispatchEvent(Texture.events.loaded, this);
	}
	
	_doOnError()
	{
		this._loaded = true;
		this.dispatchEvent(Texture.events.loaded, this);
	}

}

Texture.events = {
	loaded: 'loaded'
};

export { Texture };
