import {
	Point,
	Application,
	ComponentAnchor,
	ComponentTransform,
	Entity,
	RenderAnchor,
	createAtlasRenderComponent,
	Atlas
} from 'jincu';

import { TestCase } from '../TestCase.js';
import { TestBedRegister } from '../TestBed.js';
import { UiUtil } from '../../UiUtil.js';

import atlasRunningManImage from '../../resources/testbed/animation_running_man.png';
import atlasRunningManText from '../../resources/testbed/animation_running_man.txt';
import boyAtlasImage from '../../resources/testbed/animation_yellow_boy.png';
import boyAtlasText from '../../resources/testbed/animation_yellow_boy.txt';

const atlasParamList = [
	{
		image: atlasRunningManImage,
		text: atlasRunningManText
	},

	{
		image: boyAtlasImage,
		text: boyAtlasText
	},
];

class TestCase_Benchmark extends TestCase
{
	doInitialize()
	{
		this.doBenchmarkBatchedAnimation();
		//this.doBenchmarkUnbatchedAnimation();
	}

	createAnimationEntity(position, atlasParams)
	{
		this.getScene().addEntity(
			(new Entity())
			.addComponent(new ComponentTransform(position))
			.addComponent(new ComponentAnchor(RenderAnchor.center))
			.addComponent(createAtlasRenderComponent(Application.getInstance().getResourceManager().getAtlas(atlasParams, Atlas.formats.spritePackText)))
			.addComponent(UiUtil.createAnimation(atlasParams))
		);
	}

	getRandomPosition(point)
	{
		const viewSize = this.getScene().getPrimaryCamera().getWorldSize();

		point.x = Math.random() * viewSize.width;
		point.y = Math.random() * viewSize.height;
	}

	doBenchmarkBatchedAnimation()
	{
		const iterateCount = 2000;
		const animationCount = atlasParamList.length;

		const point = new Point();
		for(let a = 0; a < animationCount; ++a) {
			for(let i = 0; i < iterateCount / animationCount; ++i) {
				this.getRandomPosition(point);
				this.createAnimationEntity(point, atlasParamList[a]);
			}
		}
	}

	doBenchmarkUnbatchedAnimation()
	{
		const iterateCount = 2000;
		const animationCount = atlasParamList.length;

		const point = new Point();
		for(let i = 0; i < iterateCount / animationCount; ++i) {
			for(let a = 0; a < animationCount; ++a) {
				this.getRandomPosition(point);
				this.createAnimationEntity(point, atlasParamList[a]);
			}
		}
	}

}

TestBedRegister.getInstance().registerItem("Benchmark", ()=>new TestCase_Benchmark());
