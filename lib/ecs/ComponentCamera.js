import { Component } from './Component.js';
import { Camera } from '../Camera.js';
import { Entity } from './Entity.js';
import { EntityUtil } from './EntityUtil.js';

class ComponentCamera extends Component
{
	constructor()
	{
		super(Component.types.camera);

		this._camera = new Camera();
		
		this._onEntityEvent = this._onEntityEvent.bind(this);
	}

	belongs(cameraId)
	{
		return this._camera.belongs(cameraId);
	}
	
	getCamera()
	{
		return this._camera;
	}

	setWorldSize(worldSize)
	{
		this._camera.setWorldSize(worldSize);
		this.doInitializeComponentTransform(EntityUtil.getComponentByTypeFromComponent(Component.types.transform, this));
		return this;
	}

	getWorldSize()
	{
		return this._camera.getWorldSize();
	}

	setViewport(viewport)
	{
		this._camera.setViewport(viewport);
		return this;
	}

	getViewport()
	{
		return this._camera.getViewport();
	}

	setFitStrategy(strategy)
	{
		this._camera.setFitStrategy(strategy);
		return this; 
	}
	
	getFitStrategy()
	{
		return this._camera.getFitStrategy(); 
	}

	setMask(mask)
	{
		if(mask !== this.getMask()) {
			this._camera.setMask(mask);

			const componentManager = EntityUtil.getComponentManagerFromEntity(this.getEntity());
			if(componentManager) {
				componentManager.cameraMaskChanged(this);
			}
		}
		
		return this;
	}

	_onEntityEvent(e, component)
	{
		switch(e) {
		case Entity.events.componentAdded:
			if(component.getType() === Component.types.transform) {
				this.doInitializeComponentTransform(component);
			}
			break;

		case Entity.events.componentRemoving:
			if(component === this) {
				this.getEntity().removeListener(this._onEntityEvent);
			}
			break;

		}
	}

	doInitializeComponentTransform(componentTransform)
	{
		if(componentTransform) {
			componentTransform.getTransform().setProjectionMode(true);
			//const size = this._camera.getWorldSize();
			//componentTransform.setOrigin(new Point(size.width, size.height));
		}
	}

	// override
	doAfterSetEntity()
	{
		this.getEntity().addListener(Entity.events.componentAdded, this._onEntityEvent);
		this.getEntity().addListener(Entity.events.componentRemoving, this._onEntityEvent);

		this.doInitializeComponentTransform(EntityUtil.getComponentByTypeFromComponent(Component.types.transform, this));
	}

}

export { ComponentCamera };
