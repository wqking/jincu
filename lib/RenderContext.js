import { Events } from './Event.js';

class RenderContext
{
	constructor(config)
	{
		this._canvasContainer = config.container;
		this._backgroundColor = config.backgroundColor || '#ffffff';
		this._application = config.application;
	}

	getCanvasContainer()
	{
		return this._canvasContainer;
	}
	
	getBackgroundColor()
	{
		return this._backgroundColor;
	}
	
	getApplication()
	{
		return this._application;
	}

	render()
	{
		this.doBeforeRender();
		this.getApplication().getEventQueue().send(Events.render, this);
	}
	
}

export { RenderContext };
