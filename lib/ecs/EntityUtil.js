import { Component } from './Component.js';
import { Matrix } from '../Matrix.js';

let _computeRenderableMatrixCachedMatrix = new Matrix();

class EntityUtil
{
	static enumerateEntityChildren(localTransform, callback)
	{
		if(localTransform) {
			for(let i = 0; i < localTransform.getChildCount(); ++i) {
				callback(localTransform.getChildAt(i));
			}
		}
	}

	static computeRenderableMatrix(componentTransform, size)
	{
		if(! size) {
			size = componentTransform.getEntity().getComponent(Component.types.render).getSize();
		}

		const anchor = componentTransform.getEntity().getComponent(Component.types.anchor);
		if(anchor) {
			_computeRenderableMatrixCachedMatrix.assignFrom(componentTransform.getTransform().getMatrix());
			_computeRenderableMatrixCachedMatrix = anchor.apply(_computeRenderableMatrixCachedMatrix, size);
			return _computeRenderableMatrixCachedMatrix;
		}
		else {
			return componentTransform.getTransform().getMatrix();
		}
	}

	static getComponentManagerFromEntity(entity)
	{
		if(entity) {
			return entity.getComponentManager();
		}
		
		return null;
	}

	static getComponentByTypeFromComponent(type, component)
	{
		if(component) {
			let entity = component.getEntity();
			if(entity) {
				return entity.getComponent(type);
			}
		}

		return null;
	}
	
	static getParentLocalTransform(entity)
	{
		if(entity) {
			const localTransform = entity.getComponent(Component.types.localTransform);
			if(localTransform) {
				return localTransform.getParent();
			}
		}

		return null;
	}

	static getZOrder(entity)
	{
		const localTransform = entity.getComponent(Component.types.localTransform);
		if(localTransform) {
			return localTransform.getZOrder();
		}
		
		const transform = entity.getComponent(Component.types.transform);
		if(transform) {
			return transform.getZOrder();
		}
		
		return 0;
	}

}

export { EntityUtil };
