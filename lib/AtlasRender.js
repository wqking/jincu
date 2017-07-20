class AtlasRender
{
	constructor(atlas)
	{
		this._atlas = atlas;
		this._name = null;
	}
	
	getAtlas()
	{
		return this._atlas;
	}
	
	setIndex(index)
	{
		this._name = this._atlas.getNameAt(index);
	}
	
	setName(name)
	{
		this._name = name;
	}
	
	getRect()
	{
		if(! this._name) {
			this._name = this._atlas.getNameAt(0);
		}
		return this._atlas.getRect(this._name);
	}
	
	getSize()
	{
		return this.getRect();
	}

	draw(renderContext, matrix)
	{
		renderContext.drawTexture(this._atlas.getTexture(), this.getRect(), matrix);
	}
	
}

export { AtlasRender };
