import { Texture } from './Texture.js';
import { Atlas } from './Atlas.js';
import { Font as GFont } from './Font.js';
import { Util } from './util/Util.js';

class ResourceManager
{
	constructor(config)
	{
		this._resourcePath = config.resourcePath || '';
		
		this._textureMap = {};
		this._atlasMap = {};
	}

	solveResourcePath(resourceName)
	{
		return this._resourcePath + resourceName;
	}

	getTexture(resourceName, onLoaded)
	{
		let texture = this._textureMap[resourceName];
		if(! texture) {
			texture = new Texture();
			this._textureMap[resourceName] = texture;
		}
		
		if(onLoaded) {
			texture.addListenerOnce(Texture.events.loaded, onLoaded);
		}
		
		texture.load(this.solveResourcePath(resourceName));
		
		return texture;
	}

	getAtlas(params, format, onLoaded)
	{
		const key = Util.encodeJson(params);
		let atlas = this._atlasMap[key];
		if(! atlas) {
			atlas = new Atlas();
			this._atlasMap[key] = atlas;
		}

		if(onLoaded) {
			atlas.addListenerOnce(Atlas.events.loaded, onLoaded);
		}
		
		atlas.load(params, format);
		
		return atlas;
	}

	// no need to cache font at the moment.
	getFont(params)
	{
		return new GFont(params);
	}

}

export { ResourceManager };
