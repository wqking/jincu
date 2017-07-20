import { Application } from 'jincu';
import { SceneTestCase } from './SceneTestCase.js';
import { SceneTestBed } from './SceneTestBed.js';

class TestBed
{
	constructor()
	{
		this._testCase = null;
		this._scene = null;
	}

	getScene()
	{
		return this._scene;
	}

	executeTestCase(testCase)
	{
		this._testCase = testCase;
		this._scene = new SceneTestCase(this, this._testCase);

		Application.getInstance().getSceneManager().switchScene(this._scene);
	}

	finishTestCase()
	{
		this._scene = null;
		SceneTestBed.switchToScene();
	}

}

export { TestBed };


class TestBedRegister
{
	static getInstance()
	{
		return TestBedRegister._instance;
	}
	
	constructor()
	{
		this._itemList = [];
	}

	registerItem(caption, creator)
	{
		this._itemList.push({
			caption: caption,
			creator: creator
		});
	}

	getSortedItemList()
	{
		this._itemList.sort((a, b)=>{
			return a.caption.localeCompare(b.caption);
		});
		return this._itemList;
	}

}

TestBedRegister._instance = new TestBedRegister();

export { TestBedRegister };
