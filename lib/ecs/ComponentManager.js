import { EntityUtil } from './EntityUtil.js';
import { Component } from './Component.js';
import { Util } from '../util/Util.js';
import { isInRect } from '../Geometry.js';

function doRenderLocalTransformList(renderContext, transformList, parentRender)
{
	const count = transformList.length;
	let index = 0;

	while(index < count && transformList[index].getZOrder() < 0) {
		doRenderEntity(renderContext, transformList[index].getEntity());
		++index;
	}

	if(parentRender) {
		parentRender.draw(renderContext);
	}

	while(index < count) {
		doRenderEntity(renderContext, transformList[index].getEntity());
		++index;
	}
}

function doRenderEntity(renderContext, entity)
{
	const render = entity.getComponent(Component.types.render);
	const localTransform = entity.getComponent(Component.types.localTransform);
	if(localTransform) {
		doRenderLocalTransformList(renderContext, localTransform.getSortedChildren(), render);
	}
	else {
		if(render) {
			render.draw(renderContext);
		}
	}
}

function doSortTransformList(transformList)
{
	Util.mergeSort(transformList, (a, b) => {
		return EntityUtil.getZOrder(a.getEntity()) - EntityUtil.getZOrder(b.getEntity());
	});
}

function doFindTouchHandlers(
		outputResult,
		touchHandlerList,
		worldPosition
	)
{
	let itemList = [];

	for(let component of touchHandlerList) {
		if(component.canHandle(worldPosition)) {
			itemList.push({
				touchHandler: component,
				zOrderList: []
			});
		}
	}

	if(itemList.length === 0) {
		return;
	}
	else if(itemList.length === 1) {
		outputResult.push({
			handler: itemList[0].touchHandler, 
			worldPosition: worldPosition
		});
		return;
	}

	for(let item of itemList) {
		let entity = item.touchHandler.getEntity();

		while(entity) {
			const localTransform = entity.getComponent(Component.types.localTransform);
			if(localTransform) {
				item.zOrderList.push(localTransform.getZOrder());

				const parentLocalTransform = localTransform.getParent();
				if(parentLocalTransform) {
					entity = parentLocalTransform.getEntity();
				}
				else {
					entity = null;
				}
			}
			else {
				const transform = entity.getComponent(Component.types.transform);
				if(transform) {
					item.zOrderList.push(transform.getZOrder());
				}
				else {
					item.zOrderList.push(0);
				}
				entity = null;
			}
		}
	}

	Util.mergeSort(itemList, (a, b) => {
		let indexA = a.zOrderList.length - 1;
		let indexB = b.zOrderList.length - 1;

		while(indexA >= 0 && indexB >= 0) {
			if(a.zOrderList[indexA--] < b.zOrderList[indexB--]) {
				return true;
			}
		}

		if(indexA >= 0) {
			return a.zOrderList[indexA] < 0;
		}
		if(indexB >= 0) {
			return b.zOrderList[indexB] < 0;
		}

		return false;
	});

	const count = itemList.length;
	outputResult.length = count;
	for(let i =  count - 1; i >= 0; --i) {
		outputResult[count - i - 1] = {
			handler: itemList[i].touchHandler,
			worldPosition: worldPosition
		};
	}
}

class CameraInfo
{
	constructor(camera)
	{
		this._camera = camera;

		this._rootTransformList = [];
		this._needSortRootTransformList = false;
		this._touchHandlerList = [];
	}

	loadRootTransformList(componentList)
	{
		this._rootTransformList = [];
		
		for(let component of componentList) {
			if(this._camera.belongs(component.getCameraId())) {
				this._rootTransformList.push(component);
			}
		}

		this._needSortRootTransformList = true;
	}

	loadTouchHandlerList(componentList)
	{
		this._touchHandlerList = [];

		for(let component of componentList) {
			if(this.belongs(component)) {
				this._touchHandlerList.push(component);
			}
		}
	}

	zOrderChanged(transform)
	{
		if(this.belongs(transform)) {
			this._needSortRootTransformList = true;
		}
	}

	cameraIdChanged(transform, oldCameraId)
	{
		if(this._camera.belongs(oldCameraId)) {
			if(this._camera.belongs(transform.getCameraId())) {
				return;
			}

			Util.removeItemFromArray(this._rootTransformList, transform);
		}
		else {
			if(this._camera.belongs(transform.getCameraId())) {
				if(EntityUtil.getParentLocalTransform(transform.getEntity()) === null) {
					this.addTransform(transform);
				}
			}
		}
	}

	addTransform(component)
	{
		if(this._camera.belongs(component.getCameraId())) {
			this._rootTransformList.push(component);
			this._needSortRootTransformList = true;
		}
	}

	removeTransform(component)
	{
		if(this._camera.belongs(component.getCameraId())) {
			Util.removeItemFromArray(this._rootTransformList, component);
		}
	}

	addTouchHandler(component)
	{
		if(this.belongs(component)) {
			this._touchHandlerList.push(component);
		}
	}

	removeTouchHandler(component)
	{
		if(this.belongs(component)) {
			Util.removeItemFromArray(this._touchHandlerList, component);
		}
	}

	render(renderContext)
	{
		if(this._needSortRootTransformList) {
			this._needSortRootTransformList = false;
			doSortTransformList(this._rootTransformList);
		}

		const c = this._camera.getCamera();
		const componentTransform = EntityUtil.getComponentByTypeFromComponent(Component.types.transform, this._camera);
		if(componentTransform) {
			//const worldSize = c.getWorldSize();
			//componentTransform.getTransform().setOrigin(new Point(worldSize.width, worldSize.height));
			componentTransform.getTransform().setProjectionMode(true);
			const viewport = c.getViewportPixels();
			c.apply(EntityUtil.computeRenderableMatrix(componentTransform, viewport));
		}
		renderContext.switchCamera(c);

		for(let transform of this._rootTransformList) {
			doRenderEntity(renderContext, transform.getEntity());
		}
	}

	belongs(component)
	{
		let transform = EntityUtil.getComponentByTypeFromComponent(Component.types.transform, component);
		if(transform) {
			return this._camera.belongs(transform.getCameraId());
		}
		else {
			return false;
		}
	}

	findTouchHandlers(outputResult, screenPosition)
	{
		const viewport = this._camera.getCamera().getViewportPixels();
		if(isInRect(screenPosition, viewport)) {
			doFindTouchHandlers(outputResult, this._touchHandlerList, this._camera.getCamera().mapScreenToWorld(screenPosition));
		}
	}

}

class ComponentManager
{
	constructor()
	{
		this._componentListMap = {};
		this._rootTransformList = [];
		this._needSortRootTransformList = false;
		this._cameraInfoList = [];
		this._needSortCameraList = false;
	}

	add(component)
	{
		this._doGetComponentList(component.getType()).push(component);

		switch(component.getType()) {
		case Component.types.transform:
			if(! EntityUtil.getParentLocalTransform(component.getEntity())) {
				this._rootTransformList.push(component);
				this._needSortRootTransformList = true;

				for(let cameraInfo of this._cameraInfoList) {
					cameraInfo.addTransform(component);
				}
			}
			break;
		
		case Component.types.touchHandler:
			for(let cameraInfo of this._cameraInfoList) {
				cameraInfo.addTouchHandler(component);
			}
			break;
			
		case Component.types.camera: {
			this._needSortCameraList = true;
			const camera = component;
			let cameraInfo = new CameraInfo(camera);
			this._cameraInfoList.push(cameraInfo);
			cameraInfo.loadRootTransformList(this._rootTransformList);
			cameraInfo.loadTouchHandlerList(this._doGetComponentList(Component.types.touchHandler));
		}
			break;
			
		default:
			break;
		}
	}
	
	remove(component)
	{
		const componentList = this._doGetComponentList(component.getType());
		Util.removeItemFromArray(componentList, component);

		switch(component.getType()) {
		case Component.types.transform:
			if(! EntityUtil.getParentLocalTransform(component.getEntity())) {
				Util.removeItemFromArray(this._rootTransformList, component);

				for(let cameraInfo of this._cameraInfoList) {
					cameraInfo.removeTransform(component);
				}
			}
			break;
			
		case Component.types.touchHandler:
			for(let cameraInfo of this._cameraInfoList) {
				cameraInfo.removeTouchHandler(component);
			}
			break;
			
		case Component.types.camera:
			Util.removeItemIfFromArray(this._cameraInfoList, (a) => {
				return a.camera === component;
			});
			break;
			
		default:
			break;
		}
	}

	clear()
	{
		this._componentListMap = {};
		this._rootTransformList = [];
		this._needSortRootTransformList = false;
	}

	parentChanged(localTransform)
	{
		const transform = EntityUtil.getComponentByTypeFromComponent(Component.types.transform, localTransform);
		if(transform) {
			if(! localTransform.getParent()) {
				this._rootTransformList.push(transform);
				this._needSortRootTransformList = true;
				
				if(! this._needSortCameraList) {
					if(EntityUtil.getComponentByTypeFromComponent(Component.types.camera, localTransform)) {
						this.needSortCameraList = true;
					}
				}
			}
			else {
				Util.removeItemFromArray(this._rootTransformList, transform);
			}
		}
	}

	zOrderChanged(transform)
	{
		if(! EntityUtil.getParentLocalTransform(transform.getEntity())) {
			for(let cameraInfo of this._cameraInfoList) {
				cameraInfo.zOrderChanged(transform);
			}
		}
	}

	cameraIdChanged(transform, oldCameraId)
	{
		for(let cameraInfo of this._cameraInfoList) {
			cameraInfo.cameraIdChanged(transform, oldCameraId);
		}
	}

	cameraMaskChanged(camera)
	{
		for(let cameraInfo of this._cameraInfoList) {
			if(cameraInfo.camera === camera) {
				cameraInfo.loadRootTransformList(this._rootTransformList);
				cameraInfo.loadTouchHandlerList(this._doGetComponentList(Component.types.touchHandler));
				break;
			}
		}
	}

	updateLocalTransforms()
	{
		const componentList = this._doGetComponentList(Component.types.localTransform);
		for(let component of componentList) {
			if(component && ! component.getParent()) {
				component.applyGlobal();
			}
		}
	}

	updateDuringRender(renderContext)
	{
		this.updateLocalTransforms();
		this.render(renderContext);
	}

	render(renderContext)
	{
		if(this.needSortCameraList) {
			this.needSortCameraList = false;
			
			Util.mergeSort(this._cameraInfoList, (a, b)=>{
				return EntityUtil.getZOrder(a.camera.getEntity()) - EntityUtil.getZOrder(b.camera.getEntity());
			});
		}
		
		for(let cameraInfo of this._cameraInfoList) {
			cameraInfo.render(renderContext);
		}
	}

	findTouchHandlers(outputResult, screenPosition)
	{
		for(let i = this._cameraInfoList.length - 1; i >= 0; --i) {
			this._cameraInfoList[i].findTouchHandlers(outputResult, screenPosition);
		}
	}

	_doGetComponentList(type)
	{
		let result = this._componentListMap[type];
		if(! result) {
			result = new Array();
			this._componentListMap[type] = result;
		}
		return result;
	}
	
}

export { ComponentManager };
