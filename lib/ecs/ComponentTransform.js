import { Component } from './Component.js';
import { EntityUtil } from './EntityUtil.js';
import { Transform } from '../Transform.js';
import { TypeUtil } from '../util/TypeUtil.js';
import { Util } from '../util/Util.js';
import { Point, Scale } from '../Geometry.js';

class ComponentTransformBase extends Component
{
	constructor(type, position, scale, visible)
	{
		super(type);
		
		this._transform = new Transform();
		this._zOrder = 0;
		this._visible = true;
		
		if(position) {
			this._transform.setPosition(position);
		}
		if(scale) {
			this._transform.setScale(scale);
		}
		if(! TypeUtil.isNullOrUndefined(visible)) {
			this._visible = visible;
		}
	}

	getPosition()
	{
		return this._transform.getPosition();
	}
	
	setPosition(position)
	{
		this._transform.setPosition(position);
		return this;
	}
	
	getPositionX()
	{
		return this._transform.getPosition().x;
	}
	
	setPositionX(x)
	{
		ComponentTransformBase._cachedPoint.x = x;
		ComponentTransformBase._cachedPoint.y = this._transform.getPosition().y;
		this._transform.setPosition(ComponentTransformBase._cachedPoint);
		return this;
	}

	getPositionY()
	{
		return this._transform.getPosition().y;
	}
	
	setPositionY(y)
	{
		ComponentTransformBase._cachedPoint.x = this._transform.getPosition().x;
		ComponentTransformBase._cachedPoint.y = y;
		this._transform.setPosition(ComponentTransformBase._cachedPoint);
		return this;
	}

	getOrigin()
	{
		return this._transform.getOrigin();
	}
	
	setOrigin(origin)
	{
		this._transform.setOrigin(origin);
		return this;
	}

	getOriginX()
	{
		return this._transform.getOrigin().x;
	}
	
	setOriginX(x)
	{
		ComponentTransformBase._cachedPoint.x = x;
		ComponentTransformBase._cachedPoint.y = this._transform.getOrigin().y;
		this._transform.setOrigin(ComponentTransformBase._cachedPoint);
		return this;
	}

	getOriginY()
	{
		return this._transform.getOrigin().y;
	}
	
	setOriginY(y)
	{
		ComponentTransformBase._cachedPoint.x = this._transform.getOrigin().x;
		ComponentTransformBase._cachedPoint.y = y;
		this._transform.setOrigin(ComponentTransformBase._cachedPoint);
		return this;
	}

	getScale()
	{
		return this._transform.getScale();
	}
	
	setScale(scale)
	{
		this._transform.setScale(scale);
		return this;
	}

	getScaleX()
	{
		return this._transform.getScale().x;
	}
	
	setScaleX(x)
	{
		ComponentTransformBase._cachedScale.x = x;
		ComponentTransformBase._cachedScale.y = this._transform.getScale().y;
		this._transform.setScale(ComponentTransformBase._cachedScale);
		return this;
	}

	getScaleY()
	{
		return this._transform.getScale().y;
	}
	
	setScaleY(y)
	{
		ComponentTransformBase._cachedScale.y = y;
		ComponentTransformBase._cachedScale.x = this._transform.getScale().x;
		this._transform.setScale(ComponentTransformBase._cachedScale);
		return this;
	}

	getRotation()
	{
		return this._transform.getRotation();
	}
	
	setRotation(rotation)
	{
		this._transform.setRotation(rotation);
		return this;
	}

	isVisible()
	{
		return this._visible;
	}
	
	setVisible(visible)
	{
		this._visible = visible;
		return this;
	}
	
	getZOrder()
	{
		return this._zOrder;
	}
	
	setZOrder(zOrder)
	{
		if(this._zOrder !== zOrder) {
			this._zOrder = zOrder;
			this.doAfterZOrderChanged();
		}
		
		return this;
	}
	
	getTransform()
	{
		return this._transform;
	}
	
	setTransform(transform)
	{
		this._transform.assignFrom(transform);
	}

	doAfterZOrderChanged() {}
}

ComponentTransformBase._cachedPoint = new Point();
ComponentTransformBase._cachedScale = new Scale();


class ComponentTransform extends ComponentTransformBase
{
	constructor(position, scale, visible)
	{
		super(Component.types.transform, position, scale, visible)
		
		this._cameraId = 0;
	}

	getCameraId()
	{
		return this._cameraId;
	}
	
	setCameraId(cameraId)
	{
		if(this._cameraId !== cameraId) {
			const oldCameraId = this._cameraId;
			this._cameraId = cameraId;
			
			const componentManager = EntityUtil.getComponentManagerFromEntity(this.getEntity());
			if(componentManager) {
				componentManager.cameraIdChanged(this, oldCameraId);
			}
		}
	}

	// internal usage
	setCameraIdSilently(cameraId)
	{
		this._cameraId = cameraId;
	}

	// override
	doAfterZOrderChanged()
	{
		const componentManager = EntityUtil.getComponentManagerFromEntity(this.getEntity());
		if(componentManager) {
			componentManager.zOrderChanged(this);
		}
	}

}

export { ComponentTransform };


class ComponentLocalTransform extends ComponentTransformBase
{
	constructor(position, scale, visible)
	{
		super(Component.types.localTransform, position, scale, visible)

		this._parent = null;
		this._children = [];
		this._needSortChildren = false;
	}
	
	setParent(parent)
	{
		if(this._parent !== parent && this !== parent) {
			if(this._parent !== null) {
				this._parent.removeChild(this);
			}
		
			this._parent = parent;
			
			if(this._parent !== null) {
				this._parent.addChild(this);
			}

			const componentManager = EntityUtil.getComponentManagerFromEntity(this.getEntity());
			if(componentManager !== null) {
				componentManager.parentChanged(this);
			}
		}
		
		return this;
	}

	addChild(child)
	{
		this._children.push(child);
		this._needSortChildren = true;
	}

	removeChild(child)
	{
		Util.removeItemFromArray(this._children, child);
	}

	applyGlobal()
	{
		const globalTransform = this.getEntity().getComponent(Component.types.transform);

		if(globalTransform) {
			if(this._parent) {
				const parentGlobalTransform = this._parent.getEntity().getComponent(Component.types.transform);
				if(parentGlobalTransform) {
					globalTransform.setVisible(parentGlobalTransform.isVisible() && this.isVisible());
					globalTransform.setCameraIdSilently(parentGlobalTransform.getCameraId());

					globalTransform.getTransform().getMatrix().assignFrom(
						parentGlobalTransform.getTransform().getMatrix()
					).translate(
							this._parent.getTransform().getOrigin()
					).multiply(this.getTransform().getMatrix());
				}
			}
			else {
				globalTransform.setVisible(this.isVisible());
				globalTransform.setZOrder(this.getZOrder());
				globalTransform.setTransform(this.getTransform());
			}
		}

		for(let child of this._children) {
			child.applyGlobal();
		}
	}

	getSortedChildren()
	{
		if(this._needSortChildren) {
			this._needSortChildren = false;
			Util.mergeSort(this._children, (a, b)=>{
				return a.getZOrder() - b.getZOrder();
			});
		}

		return this._children;
	}

	getParent()
	{
		return this._parent;
	}
	
	getChildCount()
	{
		return this._children.length;
	}
	
	getChildAt(index)
	{
		return this._children[index];
	}

	// override
	doAfterZOrderChanged()
	{
		if(this._parent) {
			this._parent._needSortChildren = true;
		}
	}

}

export { ComponentLocalTransform };

