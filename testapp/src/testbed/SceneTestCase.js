import {
	Application,
	Scene,
	Entity,
	createAndLoadImageComponent,
	createAtlasRenderComponent,
	createAndLoadTextComponent,
	createRectRenderComponent,
	Point,
	Scale,
	Size,
	RenderAnchor,
	Component,
	ComponentTransform,
	ComponentLocalTransform,
	ComponentAnchor,
	ComponentContainerRender,
	ComponentRendererTouchHandler,
	Accessor,
	Atlas,
	Color,
	Events,
	LinearEase
} from 'jincu';

import { UiUtil } from '../UiUtil.js';

class SceneTestCase extends Scene
{
	constructor(testBed, testCase)
	{
		super();
		
		this._testBed = testBed;
		this._testCase = testCase;
	}
	
	doOnEnter()
	{
		this._testCase.initialize(this._testBed);

		this.addEntity(UiUtil.createBackButton(() => {
			this._testCase.getTestBed().finishTestCase();
		}));
	}

	doOnExit()
	{
		this._testCase.finalize();
	}

}

export { SceneTestCase };
