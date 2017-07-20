class Component
{
	constructor(type)
	{
		this._type = type;
		this._entity = null;
	}
	
	getType()
	{
		return this._type;
	}
	
	setEntity(entity)
	{
		if(this._entity) {
			const previousEntity = this._entity;
			this._entity = null;
			previousEntity.removeComponent(this);
		}

		this._entity = entity;
		
		this.doAfterSetEntity();
	}
	
	getEntity()
	{
		return this._entity;
	}
	
	didActivate()
	{
		this.doDidActivate();
	}
	
	willDeactivate()
	{
		this.doWillDeactivate();
	}
	
	doAfterSetEntity()
	{
	}

	doDidActivate()
	{
	}
	
	doWillDeactivate()
	{
	}

}

Component.types = {
	render: 'render',
	transform: 'transform',
	localTransform: 'localTransform',
	touchHandler: 'touchHandler',
	anchor: 'anchor',
	animation: 'animation',
	camera: 'camera'
};

export { Component };
