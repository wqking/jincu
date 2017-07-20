import {
	Accessor,
	Point,
	Scale,
	Color,
	Application,
	Component,
	ComponentAnchor,
	ComponentRendererTouchHandler,
	ComponentTransform,
	ComponentLocalTransform,
	Events,
	Entity,
	RenderAnchor,
	Atlas,
	createAndLoadTextComponent,
	createAndLoadImageComponent,
	createAtlasRenderComponent,
	
	ElasticEase,
} from 'jincu';

import { TestCase } from '../TestCase.js';
import { TestBedRegister } from '../TestBed.js';
import { UiUtil } from '../../UiUtil.js';

import catImage from '../../resources/testbed/cat.png';
import dogImage from '../../resources/testbed/dog.png';
import pigImage from '../../resources/testbed/pig.png';
import rabbitImage from '../../resources/testbed/rabbit.png';
import boyAtlasImage from '../../resources/testbed/animation_yellow_boy.png';
import boyAtlasText from '../../resources/testbed/animation_yellow_boy.txt';

class TestCase_SceneGraph extends TestCase
{
	doInitialize()
	{
		this.doInitializeStatic(new Point(150, 50));
		this.doInitializeRotation(new Point(300, 50));
		this.doInitializeRotationAnimation(new Point(450, 350));
	}

	createParentedObject(position, anchor, rotation, scale)
	{
		const imageNameA = catImage;
		const imageNameB = dogImage;
		const imageNameC = pigImage;
		const imageNameD = rabbitImage;
		const x = position.x;
		const y = position.y;
	//	const xDelta = 150;
		const yDelta = 150;
		
		rotation = rotation || 0;
		scale = scale || 1;
		anchor = anchor || RenderAnchor.leftTop;

		let result = null;

		let entityA = null;
		let entityB = null;
		let entityD = null;

		entityB = new Entity();
		this.getScene().addEntity(
			(entityA = new Entity())
			.addComponent(new ComponentTransform())
			.addComponent((result = new ComponentLocalTransform(new Point(x, y))).setRotation(rotation).setScale(new Scale(scale, scale)))
			.addComponent(new ComponentAnchor(anchor))
			.addComponent(createAndLoadImageComponent(imageNameA))
			.addComponent(new ComponentRendererTouchHandler().addOnTouch(Events.touchPressed, ()=>{
				console.log("clicked: imageA");
				entityB.getComponent(Component.types.localTransform).setVisible(! entityB.getComponent(Component.types.localTransform).isVisible());
			}))
		);

		this.getScene().addEntity(
			entityB
			.addComponent(new ComponentTransform())
			.addComponent(new ComponentLocalTransform(new Point(0, yDelta)).setParent(entityA.getComponent(Component.types.localTransform)))
			.addComponent(new ComponentAnchor(anchor).setFlipX(true))
			.addComponent(createAndLoadImageComponent(imageNameB))
			.addComponent(new ComponentRendererTouchHandler().addOnTouch(Events.touchPressed, ()=>{ console.log("clicked: imageB-A flip x"); }))
		);

		this.getScene().addEntity(
			(new Entity())
			.addComponent(new ComponentTransform())
			.addComponent(new ComponentLocalTransform(new Point(0, yDelta)).setParent(entityB.getComponent(Component.types.localTransform)))
			.addComponent(new ComponentAnchor(anchor).setFlipY(true))
			.addComponent(createAndLoadImageComponent(imageNameC))
			.addComponent(new ComponentRendererTouchHandler().addOnTouch(Events.touchPressed, ()=>{ console.log("clicked: imageC-B flip y"); }))
		);

		const atlasParams = {
				image: boyAtlasImage,
				text: boyAtlasText
			};
		entityD = new Entity();
		this.getScene().addEntity(
			entityD
			.addComponent(new ComponentTransform())
			.addComponent(new ComponentLocalTransform(new Point(0, yDelta * 2)).setParent(entityB.getComponent(Component.types.localTransform)))
			.addComponent(new ComponentAnchor(anchor).setFlipX(true).setFlipY(true))
			.addComponent(createAtlasRenderComponent(Application.getInstance().getResourceManager().getAtlas(atlasParams, Atlas.formats.spritePackText)))
			.addComponent(UiUtil.createAnimation(atlasParams))
			.addComponent(new ComponentRendererTouchHandler().addOnTouch(Events.touchPressed, ()=>{ console.log("clicked: imageD-B flip x/y"); }))
		);

		return result;
	}

	doInitializeStatic(position)
	{
		this.createParentedObject(position, RenderAnchor.leftTop);
	}

	doInitializeRotation(position)
	{
		this.createParentedObject(position, RenderAnchor.leftTop, -45, 0.75);
	}

	doInitializeRotationAnimation(position)
	{
		const localTransform = this.createParentedObject(position, RenderAnchor.center, 0, 0.5);
		this.getScene().getTweenList().tween()
			.duration(10000)
			//.ease(cpgf::ElasticEase::easeOut())
			.ease(ElasticEase.easeOut())
			.repeat(-1)
			.target(Accessor.create(localTransform.getRotation.bind(localTransform), localTransform.setRotation.bind(localTransform)), 360)
		;

		const childLocalTransform = localTransform.getChildAt(0).getChildAt(0);
		this.getScene().getTweenList().tween()
			.duration(3000)
			//.ease(cpgf::ElasticEase::easeOut())
			.repeat(-1)
			.target(Accessor.create(childLocalTransform.getRotation.bind(childLocalTransform), childLocalTransform.setRotation.bind(childLocalTransform)), 360)
		;
	}

}

TestBedRegister.getInstance().registerItem("Scene Graph", ()=>new TestCase_SceneGraph());
