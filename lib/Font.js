import { TypeUtil } from './util/TypeUtil.js';

class Font
{
	constructor(params)
	{
		params = params || {};

		this._css = null;

		this._size = params.size || 24;
		this._family = params.family || 'sans-serif';
		this._italic = params.italic;
		this._weight = params.weight;
	}
	
	getSize()
	{
		return this._size;
	}
	
	getCss()
	{
		if(! this._css) {
			this._css = '';
			
			if(this._italic) {
				this._css += ' italic';
			}
			
			this._css += ' ' + this._size;
			if(TypeUtil.isNumber(this._size)) {
				this._css += 'px';
			}
			
			if(this._weight) {
				this._css += ' ' + this._weight;
			}
			
			this._css += ' ' + this._family;
		}
		
		return this._css;
	}

}

export { Font };
