import { Application } from './Application.js';
import { Image as GImage } from './Image.js';
import { NetLoader } from './net/NetLoader.js';
import { NetLoaderQueue } from './net/NetLoaderQueue.js';
import { Util } from './util/Util.js';
import { Rect } from './Geometry.js';
import { EventDispatcher } from './EventDispatcher.js';

class Atlas extends EventDispatcher
{
	// loader is function(object params, Atlas * atlas, onFinish);
	static registerLoader(format, loader)
	{
		Atlas._loaderMap[format] = loader;
	}

	constructor()
	{
		super();

		this._texture = null;
		this._imageName = null;
		this._itemList = [];
		this._itemMap = {};
		this._loader = null;
		
		this._onLoaderFinish = this._onLoaderFinish.bind(this);
		this._onTextureLoaded = this._onTextureLoaded.bind(this);
	}
	
	getTexture()
	{
		return this._texture;
	}
	
	getItemList()
	{
		return this._itemList;
	}
	
	getImage(name)
	{
		const index = this._itemMap[name];
		if(! this._itemList[index].image) {
			this._itemList[index].image = new GImage(this._texture, this._itemList[index].rect);
		}
		return this._itemList[index].image;
	}
	
	getRect(name)
	{
		const item = this._itemList[this._itemMap[name]];
		if(item) {
			return item.rect;
		}
		return null;
	}
	
	getNameAt(index)
	{
		const item = this._itemList[index];
		if(item) {
			return item.name;
		}
		return null;
	}
	
	getIndex(name)
	{
		return this._itemMap[name];
	}
	
	load(params, format)
	{
		if(this._loader) {
			return;
		}
		if(this._texture) {
			this.dispatchEvent(Atlas.events.loaded, this);
			return;
		}

		this._texture = null;
		this._imageName = null;
		this._itemList = [];
		this._itemMap = {};

		this._loader = Atlas._loaderMap[format];
		this._loader(params, this, this._onLoaderFinish);
	}

	appendSubImage(name, rect)
	{
		const item = {
			name: name,
			rect: rect,
			image: null
		};
		
		this._itemMap[name] = this._itemList.length;
		this._itemList.push(item);
	}

	setImageName(imageName)
	{
		this._imageName = imageName;
	}

	_onLoaderFinish()
	{
		this._loader = null;
		this._texture = Application.getInstance().getResourceManager().getTexture(this._imageName, this._onTextureLoaded);
	}

	_onTextureLoaded()
	{
		this.dispatchEvent(Atlas.events.loaded, this);
	}

}

Atlas.formats = {
	// http://spritesheetpacker.codeplex.com/
	// a = 0 0 60 60
	// b = 61 0 60 60
	// c = 0 61 60 60
	spritePackText: 'spritePackText'
};

Atlas.events = {
	loaded: 'loaded'
};

Atlas._loaderMap = {};

export { Atlas };

function loaderSpritePackTextLoaded(netLoader, atlas, onLoaded)
{
	const text = netLoader.getResponseData();
	const lines = text.split("\n");
	const re = new RegExp(/^(.*)\s*=\s*(\d+)\s*(\d+)\s*(\d+)\s*(\d+)/);
	
	for(let line of lines) {
		const result = re.exec(line);
		if(result) {
			const name = result[1].trim();
			const rect = new Rect(
				Util.toInt(result[2]),
				Util.toInt(result[3]),
				Util.toInt(result[4]),
				Util.toInt(result[5])
			);
			atlas.appendSubImage(name, rect);
			//console.log(name + '=>' + rect.x + ' ' + rect.y + ' ' + rect.width + ' ' + rect.height);
		}
	}
	
	onLoaded();
}

function loaderSpritePackText(params, atlas, onLoaded)
{
	atlas.setImageName(params.image);
	
	const loader = new NetLoader({
		url: params.text,
		dataType: 'text'
	});
	loader.addListenerOnce(NetLoader.events.loaded, ()=>{
		loaderSpritePackTextLoaded(loader, atlas, onLoaded);
	});
	NetLoaderQueue.getInstance().append(loader);
}

Atlas.registerLoader(Atlas.formats.spritePackText, loaderSpritePackText);

