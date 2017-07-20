import { Component } from './Component.js';
import { EventDispatcher } from '../EventDispatcher.js';
import { EntityUtil } from './EntityUtil.js';
import { isInRect } from '../Geometry.js';
import { Matrix } from '../Matrix.js';

class ComponentTouchHandler extends Component
{
	constructor()
	{
		super(Component.types.touchHandler);

		this._eventDispatch = new EventDispatcher();
	}

	addOnTouch(e, handler)
	{
		this._eventDispatch.addListener(e, handler);
		
		return this;
	}

	removeOnTouch(e, handler)
	{
		this._eventDispatch.removeListener(e, handler);
		
		return this;
	}

	canHandle(worldPosition)
	{
		return this.doCanHandle(worldPosition);
	}

	doCanHandle(/*worldPosition*/)
	{
		return false;
	}
	
	handle(e, worldPosition)
	{
		this._eventDispatch.dispatchEvent(e, worldPosition);
	}

}

export { ComponentTouchHandler };


class ComponentRendererTouchHandler extends ComponentTouchHandler
{
	constructor()
	{
		super();
		
		this._cachedMatrix = new Matrix();
	}

	// override
	doCanHandle(worldPosition)
	{
		const transform = this.getEntity().getComponent(Component.types.transform);
		if(! transform.isVisible()) {
			return false;
		}

		const size = this.getEntity().getComponent(Component.types.render).getSize();
		if(! size) {
			return false;
		}

		this._cachedMatrix.assignFrom(EntityUtil.computeRenderableMatrix(transform));
		let matrix = this._cachedMatrix.invert();

		const normalizedPoint = matrix.transformPoint(worldPosition);
		return isInRect(normalizedPoint, size);
	}
}

export { ComponentRendererTouchHandler };

