import { ComponentManager } from './ecs/ComponentManager.js';
import { ComponentTransform } from './ecs/ComponentTransform.js';
import { ComponentCamera } from './ecs/ComponentCamera.js';
import { Component } from './ecs/Component.js';
import { Entity } from './ecs/Entity.js';
import { Application } from './Application.js';
import { Events, TouchEvent } from './Event.js';
import { TweenList } from './tween/TweenList.js';
import { Util } from './util/Util.js';

//import { ComponentAnchor } from './ecs/ComponentAnchor.js';
//import { RenderAnchor } from './RenderAnchor.js';

class Scene
{
	constructor()
	{
		this._componentManager = new ComponentManager();
		this._entityList = [];
		this._renderEnabled = false;
		this._primaryCamera = null;
		this._touchCapture = null;
		this._cahcedTouchEvent = new TouchEvent();
		this._tweenList = new TweenList();
		
		this._onRender = this._onRender.bind(this);
		this._doHandleTouchEvent = this._doHandleTouchEvent.bind(this);
	}
	
	enableRender(enable)
	{
		if(this._renderEnabled != enable) {
			this._renderEnabled = enable;

			Application.getInstance().getEventQueue().removeListener(Events.render, this._onRender);
			Application.getInstance().getEventQueue().removeListener(Events.touchMoved, this._doHandleTouchEvent);
			Application.getInstance().getEventQueue().removeListener(Events.touchPressed, this._doHandleTouchEvent);
			Application.getInstance().getEventQueue().removeListener(Events.touchReleased, this._doHandleTouchEvent);

			if(enable) {
				Application.getInstance().getEventQueue().addListener(Events.render, this._onRender);
				Application.getInstance().getEventQueue().addListener(Events.touchMoved, this._doHandleTouchEvent);
				Application.getInstance().getEventQueue().addListener(Events.touchPressed, this._doHandleTouchEvent);
				Application.getInstance().getEventQueue().addListener(Events.touchReleased, this._doHandleTouchEvent);
			}
		}
	}

	initializePrimaryCamera()
	{
		if(this._primaryCamera !== null) {
			this.removeEntity(this._primaryCamera.getEntity());
		}

		let cameraEntity = new Entity();
		cameraEntity.addComponent(new ComponentTransform({x:0,y:0}));
		this._primaryCamera = new ComponentCamera();
		cameraEntity.addComponent(this._primaryCamera);
		//cameraEntity.addComponent(new ComponentAnchor(RenderAnchor.leftTop).setFlipX(true).setFlipY(true));

		this.addEntity(cameraEntity);
	}
	
	getPrimaryCamera()
	{
		return this._primaryCamera;
	}
	
	getTweenList()
	{
		return this._tweenList;
	}

	onEnter()
	{
		console.log('Enter scene: ' + this.constructor.name);
		
		this.initializePrimaryCamera();
		this.enableRender(true);
		this.doOnEnter();
	}
	
	onExit()
	{
		console.log('Exit scene: ' + this.constructor.name);
		
		this.enableRender(false);
		
		this.doOnExit();
		
		this._tweenList.clear();
	}
	
	addEntity(entity)
	{
		if(entity) {
			this._entityList.push(entity);
			entity.setComponentManager(this._componentManager);
		}

		return entity;
	}

	removeEntity(entity)
	{
		if(! entity) {
			return;
		}
		
		entity.setComponentManager(null);
		Util.removeItemFromArray(this._entityList, entity);
	}

	doOnEnter()
	{
	}
	
	doOnExit()
	{
	}

	_onRender(e, renderContext)
	{
		this._tweenList.tick(Application.getInstance().getRenderMilliseconds());
		this._componentManager.updateDuringRender(renderContext);
	}
	
	_doHandleTouchEvent(e, screenPosition)
	{
		let handlerList = [];

		this._componentManager.findTouchHandlers(handlerList, screenPosition);

		this._cahcedTouchEvent.screenPosition = screenPosition;

		if(handlerList.length === 0) {
			if(this._touchCapture) {
				this._cahcedTouchEvent.touchedEntity = null;
				this._cahcedTouchEvent.worldPosition = this._cahcedTouchEvent.screenPosition;
				this.touchCapture.getComponent(Component.types.touchHandler).handle(e, this._cahcedTouchEvent);
			}
		}
		else {
			for(let item of handlerList) {
				this._cahcedTouchEvent.propagation = false;
				this._cahcedTouchEvent.touchedEntity = item.handler.getEntity();
				this._cahcedTouchEvent.worldPosition = item.worldPosition;
				if(! this.touchCapture) {
					item.handler.handle(e, this._cahcedTouchEvent);
				}
				else {
					this.touchCapture.getComponent(Component.types.touchHandler).handle(e, this._cahcedTouchEvent);
				}

				if(! this._cahcedTouchEvent.propagation) {
					break;
				}
			}
		}

	}

}

export { Scene };
