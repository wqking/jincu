import { EventDispatcher } from '../EventDispatcher.js';

class Entity extends EventDispatcher
{
	constructor()
	{
		super();

		this._componentMap = {};
		this._componentManager = null;
	}

	addComponent(component)
	{
		let type = component.getType();
		let previousComponent = this._componentMap[type];
		if(previousComponent) {
			previousComponent.setEntity(null);
		}

		this._componentMap[type] = component;
		component.setEntity(this);
		
		this.dispatchEvent(Entity.events.componentAdded, component);

		return this;
	}

	removeComponent(component)
	{
		this.dispatchEvent(Entity.events.componentRemoving, component);

		let type = component.getType();
		component.setEntity(null);
		delete this._componentMap[type];
	}

	getComponent(type)
	{
		return this._componentMap[type];
	}

	setComponentManager(componentManager)
	{
		if(this._componentManager !== componentManager) {
			if(this._componentManager) {
				for(let key in this._componentMap) {
					this._componentMap[key].willDeactivate();
					this._componentManager.remove(this._componentMap[key]);
				}
			}
			
			this._componentManager = componentManager;
			
			if(this._componentManager) {
				for(let key in this._componentMap) {
					this._componentManager.add(this._componentMap[key]);
					this._componentMap[key].didActivate();
				}
			}
		}
	}
	
	getComponentManager()
	{
		return this._componentManager;
	}
	
}

Entity.events = {
	componentAdded: 'componentAdded',
	componentRemoving: 'componentRemoving'
};

export { Entity };
