import { Events } from './Event.js';
import { Transition } from './transition/Transition.js';

class SceneManager
{
	constructor(params)
	{
		this._application = params.application;
	
		this._currentScene = null;
		this._sceneToSwitch = null;
		this._transition = null;
		
		this._doOnSwitchScene = this._doOnSwitchScene.bind(this);
		this._doOnTransitionFinished = this._doOnTransitionFinished.bind(this);
	}
	
	getCurrentScene()
	{
		return this._currentScene;
	}
	
	switchScene(scene, transition)
	{
		if(! scene) {
			return;
		}
		
		this._transition = transition;

		this._sceneToSwitch = scene;
		this._application.getEventQueue().addListener(Events.update, this._doOnSwitchScene);
	}
	
	_doOnSwitchScene()
	{
		this._application.getEventQueue().removeListener(Events.update, this._doOnSwitchScene);

		if(! this._transition || ! this._sceneToSwitch || ! this._currentScene) {
			this._doSwitchScene(true);
		}
		else {
			this._sceneToSwitch.onEnter();
			this._transition.addListenerOnce(Transition.events.finished, this._doOnTransitionFinished);
			this._transition.transite(this._currentScene, this._sceneToSwitch);
		}
	}
	
	_doOnTransitionFinished()
	{
		this._transition = null;
		this._doSwitchScene(false);
	}
	
	_doSwitchScene(enterNewScene)
	{
		if(this._currentScene) {
			this._currentScene.onExit();
		}

		this._currentScene = this._sceneToSwitch;

		if(this._currentScene && enterNewScene) {
			this._currentScene.onEnter();
		}
	}
	
}

export { SceneManager };
