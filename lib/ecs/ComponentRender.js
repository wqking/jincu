import { Component } from './Component.js';
import { EntityUtil } from './EntityUtil.js';
import { Image } from '../Image.js';
import { AtlasRender } from '../AtlasRender.js';
import { TextRender } from '../TextRender.js';
import { RectRender } from '../RectRender.js';
import { Application } from '../Application.js';
import { Size } from '../Geometry.js';

class ComponentRender extends Component
{
	constructor()
	{
		super(Component.types.render);
	}

	draw(renderContext) {
		this.doDraw(renderContext);
	}

	getSize() {
		return this.doGetSize();
	}

	// abstract
	//doDraw(renderContext);
	//doGetSize();
}

export { ComponentRender };


class ComponentContainerRender extends ComponentRender
{
	constructor()
	{
		super();
		
		this._size = new Size();
		this._renderList = [];
	}

	add(render)
	{
		this._size.width = -1;

		this._renderList.push(render);
		render.setEntity(this.getEntity());

		return this;
	}

	doDraw(renderContext)
	{
		for(let render of this._renderList) {
			render.draw(renderContext);
		}
	}

	doGetSize()
	{
		if(this._size.width < 0) {
			this._size.width = 0;
			this._size.height = 0;
			
			for(let render of this._renderList) {
				const renderSize = render.getSize();
				if(this._size.width < renderSize.width) {
					this._size.width = renderSize.width;
				}
				if(this._size.height < renderSize.height) {
					this._size.height = renderSize.height;
				}
			}
		}

		return this._size;
	}

	// override
	doAfterSetEntity()
	{
		const entity = this.getEntity();
		for(let render of this._renderList) {
			render.setEntity(entity);
		}
	}

}

export { ComponentContainerRender };


class ComponentRenderCommon extends ComponentRender
{
	constructor(render)
	{
		super();

		this._render = render;
	}
	
	getRender()
	{
		return this._render;
	}

	doDraw(renderContext)
	{
		const size = this.getSize();
		if(! size) return;
		const transform = this.getEntity().getComponent(Component.types.transform);
		this._render.draw(renderContext, EntityUtil.computeRenderableMatrix(transform, size));
	}

	doGetSize()
	{
		return this._render.getSize();
	}

}

const ComponentImageRender = ComponentRenderCommon;
const ComponentAtlasRender = ComponentRenderCommon;
const ComponentTextRender = ComponentRenderCommon;
const ComponentRectender = ComponentRenderCommon;

export {
	ComponentImageRender,
	ComponentAtlasRender,
	ComponentTextRender,
	ComponentRectender
};

export function createAndLoadImageComponent(resourceName)
{
	const texture = Application.getInstance().getResourceManager().getTexture(resourceName);
	return new ComponentImageRender(new Image(texture));
}

export function createAtlasRenderComponent(atlas, name)
{
	const render = new AtlasRender(atlas);
	if(name && name.length > 0) {
		render.setName(name);
	}
	return new ComponentAtlasRender(render);
}

export function createAndLoadTextComponent(text, font, color)
{
	return new ComponentTextRender(new TextRender(text, font, color));
}

export function createRectRenderComponent(color, size)
{
	return new ComponentRectender(new RectRender(color, size));
}

