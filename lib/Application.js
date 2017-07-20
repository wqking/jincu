import jQuery from 'jquery';

import { RenderContextCanvas2D } from './RenderContextCanvas2D.js';
import { SceneManager } from './SceneManager.js';
import { ResourceManager } from './ResourceManager.js';
import { EventQueue } from './EventQueue.js';
import { Events } from './Event.js';
import { Size } from './Geometry.js';
import { Util } from './util/Util.js';
import { TweenList } from './tween/TweenList.js';

class Application
{
	static getInstance()
	{
		return Application._instance;
	}

	constructor(config)
	{
		Application._instance = this;

		config.fps = config.fps || 30;

		this._config = config;

		this._config.container = jQuery(config.container);
		this._config.application = this;
		this._renderContext = new RenderContextCanvas2D(this._config);
		
		this._sceneManager = new SceneManager(this._config);
		this._resourceManager = new ResourceManager(this._config);
		
		this._eventQueue = new EventQueue();
		
		this._screenSize = new Size();

		this._previousFrameTime = 0;
		this._frameMilliseconds = 30;
		this._frameCount = 1;
	}
	
	run(entryScene)
	{
		this._initialize();

		this._doRefreshScreenSize();

		entryScene = entryScene || this._config.entryScene;
		this._sceneManager.switchScene(entryScene);

		this._previousFrameTime = Util.getCurrentMilliseconds();

		setInterval(this._doOnTick.bind(this), 1000 / this._config.fps);
	}

	getRenderContext()
	{
		return this._renderContext;
	}

	getSceneManager()
	{
		return this._sceneManager;
	}
	
	getResourceManager()
	{
		return this._resourceManager;
	}

	getEventQueue()
	{
		return this._eventQueue;
	}
	
	getScreenSize()
	{
		return this._screenSize;
	}
	
	getTargetViewSize()
	{
		return this._config.targetViewSize || this._screenSize;
	}
	
	getFrameMilliseconds()
	{
		return this._frameMilliseconds;
	}
	
	getRenderMilliseconds()
	{
		return this._frameMilliseconds;
	}
	
	getFrameCount()
	{
		return this._frameCount;
	}

	doInitialize()
	{
	}
	
	_initialize()
	{
	}
	
	_doOnTick()
	{
		this._eventQueue.process();
		
		TweenList.getInstance().tick(this._frameMilliseconds);

		this._eventQueue.send(Events.update);

		this._renderContext.render();

		const time = Util.getCurrentMilliseconds();
		this._frameMilliseconds = time - this._previousFrameTime;
		this._previousFrameTime = time;
		++this._frameCount;
		
//console.log(this._frameMilliseconds);
	}

	_doRefreshScreenSize()
	{
		this._screenSize.width = this._config.container.width();
		this._screenSize.height = this._config.container.height();
	}

}

Application._instance = null;

export { Application };
