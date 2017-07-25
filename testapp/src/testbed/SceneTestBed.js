import {
	Application,
	Scene,
	Entity,
	createAndLoadTextComponent,
	createRectRenderComponent,
	Point,
	Size,
	RenderAnchor,
	ComponentTransform,
	ComponentLocalTransform,
	ComponentAnchor,
	ComponentContainerRender,
	ComponentRendererTouchHandler,
	Color,
	Events,
	TransitionMoveIn
} from 'jincu';

import { SceneMenu, MenuRegister } from '../SceneMenu.js';
import { TestBed, TestBedRegister } from './TestBed.js';
import { UiUtil } from '../UiUtil.js';

export { TestCase_Flip } from './testcases/TestCase_Flip.js';
export { TestCase_SceneGraph } from './testcases/TestCase_SceneGraph.js';
export { TestCase_Tween } from './testcases/TestCase_Tween.js';
export { TestCase_Jumper } from './testcases/TestCase_Jumper.js';
export { TestCase_Benchmark } from './testcases/TestCase_Benchmark.js';

class SceneTestBed extends Scene
{
	static switchToScene()
	{
		Application.getInstance().getSceneManager().switchScene(new SceneTestBed(), new TransitionMoveIn());
	}

	constructor()
	{
		super();
	
		this._testBed = new TestBed();
	}
	
	doOnEnter()
	{
		this.addEntity(UiUtil.createBackButton(() => {
			Application.getInstance().getSceneManager().switchScene(new SceneMenu());
		}));

		const itemList = TestBedRegister.getInstance().getSortedItemList();

		const itemCount = itemList.length;
		const viewWidth = this.getPrimaryCamera().getWorldSize().width;
		const viewHeight = this.getPrimaryCamera().getWorldSize().height;
		const tileSize = new Size(200, 60);
		const xSpace = 10;
		const ySpace = 10;
		const rowCount = 7;

		const actualRowCount = Math.min(itemCount, rowCount);
		const actualColumnCount = itemCount / rowCount + (itemCount % rowCount === 0 ? 0 : 1);

		const totalHeight = actualRowCount * tileSize.height + (actualRowCount - 1) * ySpace;
		const yStart = (viewHeight - totalHeight) / 2;
		const totalWidth = actualColumnCount * tileSize.width + (actualColumnCount - 1) * xSpace;
		const xStart = (viewWidth - totalWidth + tileSize.width) / 2;

		for(let i = 0; i < itemCount; ++i) {
			const item = itemList[i];
			const row = i % rowCount;
			const column = (i / rowCount) | 0;
			this.addEntity(
				(new Entity())
					.addComponent(new ComponentTransform())
					.addComponent(new ComponentLocalTransform(new Point(xStart + (tileSize.width + xSpace) * column, yStart + (tileSize.height + ySpace) * row)))
					.addComponent(new ComponentAnchor(RenderAnchor.center))
					.addComponent(new ComponentContainerRender()
						.add(createRectRenderComponent(Color.fromValue(0xffeeee77), tileSize))
						.add(createAndLoadTextComponent(item.caption, Application.getInstance().getResourceManager().getFont({ size: 24 }), Color.blue))
					)
					.addComponent(new ComponentRendererTouchHandler().addOnTouch(Events.touchPressed, ()=>{
						this._testBed.executeTestCase(item.creator());
					}))
			);
		}
	}
}

export { SceneTestBed };

MenuRegister.getInstance().registerItem("test bed", 1, ()=>{
		SceneTestBed.switchToScene();
	},
	Color.fromValue(0xffeeee77)
);
