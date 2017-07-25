import {
	Point,
	Size,
	Scale,
	Application,
	ComponentAnchor,
	ComponentTransform,
	Events,
	Entity,
	RenderAnchor,
	createAndLoadImageComponent,
	TweenList,
	tweenRepeatInfinitely,
	Accessor,
	Getter,
	ElasticEase,
	CubicEase,
	BounceEase,
	SineEase,
	QuintEase
} from 'jincu';

import { TestCase } from '../TestCase.js';
import { TestBedRegister } from '../TestBed.js';
import { UiUtil, defaultButtonSize } from '../../UiUtil.js';

import rabbitImage from '../../resources/testbed/rabbit.png';

const imageName = rabbitImage;
const imageSize = new Size(120, 103);
const spriteBoardStart = new Point(200, 100);
const spriteBoardSize = new Size(500, 400);
const spriteBoardEnd = new Point(spriteBoardStart.x + spriteBoardSize.width, spriteBoardStart.y + spriteBoardSize.height);

class TestCase_Tween extends TestCase
{
	constructor()
	{
		super();
		this._tweenList = new TweenList();
		this._entityList = [];
		
		this.onUpdate = this.onUpdate.bind(this);
	}

	doInitialize()
	{
		const buttonSize = defaultButtonSize;
		let buttonX = buttonSize.width / 2 + 10;
		let buttonY = 100;
		const yDelta = buttonSize.height + 20;
		
		this.getScene().addEntity(UiUtil.createButton(
			"Basic",
			new Point(buttonX, buttonY),
			()=>{ this.doExecuteTest(this.doTestBasic.bind(this)); },
			buttonSize
		));
		buttonY += yDelta;
	
		this.getScene().addEntity(UiUtil.createButton(
			"Follow",
			new Point(buttonX, buttonY),
			()=>{ this.doExecuteTest(this.doTestFollow.bind(this)); },
			buttonSize
		));
		buttonY += yDelta;
	
		this.getScene().addEntity(UiUtil.createButton(
			"Timeline 1",
			new Point(buttonX, buttonY),
			()=>{ this.doExecuteTest(this.doTestTimeline1.bind(this)); },
			buttonSize
		));
		buttonY += yDelta;
	
		this.getScene().addEntity(UiUtil.createButton(
			"Timeline 2",
			new Point(buttonX, buttonY),
			()=>{ this.doExecuteTest(this.doTestTimeline2.bind(this)); },
			buttonSize
		));
		buttonY += yDelta;
	
		Application.getInstance().getEventQueue().addListener(Events.update, this.onUpdate);

	}

	doFinalize()
	{
		Application.getInstance().getEventQueue().removeListener(Events.update, this.onUpdate);
	}

	onUpdate()
	{
		this._tweenList.tick(Application.getInstance().getFrameMilliseconds());
	}

	doExecuteTest(handler)
	{
		this._tweenList.clear();
		
		for(let entity of this._entityList) {
			this.getScene().removeEntity(entity);
		}
		this._entityList = [];
		
		handler();
	}

	addImage(resourceName, position)
	{
		let result = null;
		this.addEntity(
			(new Entity())
			.addComponent(result = new ComponentTransform(position))
			.addComponent(new ComponentAnchor(RenderAnchor.center))
			.addComponent(createAndLoadImageComponent(resourceName))
		);
		return result;
	}

	addEntity(entity)
	{
		this.getScene().addEntity(entity);
		this._entityList.push(entity);
	}

	doTestBasic()
	{
		const duration = 2000;

		const sprite = this.addImage(imageName, new Point(spriteBoardStart.x, spriteBoardStart.y));
		const target = this.addImage(imageName, new Point(spriteBoardEnd.x, spriteBoardEnd.y));
		
//		target.getEntity().getComponent(Component.types.render)->setColor(colorSetAlpha(colorWhite, 127));

		this._tweenList.tween()
			.duration(duration)
			.target(Accessor.create(sprite.getPositionX.bind(sprite), sprite.setPositionX.bind(sprite)), target.getPosition().x)
			.target(Accessor.create(sprite.getPositionY.bind(sprite), sprite.setPositionY.bind(sprite)), target.getPosition().y)
			.target(Accessor.create(sprite.getRotation.bind(sprite), sprite.setRotation.bind(sprite)), 180, 360)
			.repeat(tweenRepeatInfinitely)
	//		.backward(true)
			.yoyo(true)
		;
	}

	doTestFollow()
	{
		const duration = 2000;

		const target = this.addImage(imageName, new Point(spriteBoardStart.x, spriteBoardEnd.y));
		const sprite = this.addImage(imageName, new Point(spriteBoardStart.x, spriteBoardStart.y));
		const sprite2 = this.addImage(imageName, new Point(spriteBoardEnd.x, spriteBoardStart.y));
		
		//target->getEntity()->getComponentByType<GComponentRender>()->setColor(colorSetAlpha(colorWhite, 127));

		this._tweenList.tween()
			.duration(duration)
			.follow(Accessor.create(sprite.getPositionX.bind(sprite), sprite.setPositionX.bind(sprite)), Getter.create(target.getPositionX.bind(target)))
			.follow(Accessor.create(sprite.getPositionY.bind(sprite), sprite.setPositionY.bind(sprite)), Getter.create(target.getPositionY.bind(target)))
		;

		this._tweenList.tween()
			.duration(duration)
			.follow(Accessor.create(sprite2.getPositionX.bind(sprite2), sprite2.setPositionX.bind(sprite2)), Getter.create(sprite.getPositionX.bind(sprite)))
			.follow(Accessor.create(sprite2.getPositionY.bind(sprite2), sprite2.setPositionY.bind(sprite2)), Getter.create(sprite.getPositionY.bind(sprite)))
		;

		this._tweenList.tween()
			.duration(duration)
			.target(Accessor.create(target.getPositionX.bind(target), target.setPositionX.bind(target)), spriteBoardEnd.x)
			.target(Accessor.create(target.getPositionY.bind(target), target.setPositionY.bind(target)), spriteBoardEnd.y)
		;
	}

	doTestTimeline1()
	{
		const duration = 2000;

		//const target = this.addImage(imageName, new Point(spriteBoardEnd.x, spriteBoardEnd.y));
		const sprite = this.addImage(imageName, new Point(spriteBoardStart.x, spriteBoardStart.y));
		
		//target->getEntity()->getComponentByType<GComponentRender>()->setColor(colorSetAlpha(colorWhite, 127));

		const timeline = this._tweenList.timeline();

		timeline.append(
			timeline.tween()
				.duration(duration)
				.relative(Accessor.create(sprite.getPositionX.bind(sprite), sprite.setPositionX.bind(sprite)), spriteBoardSize.width)
				.relative(Accessor.create(sprite.getPositionY.bind(sprite), sprite.setPositionY.bind(sprite)), 0)
		);

		timeline.append(
			timeline.tween()
				.duration(duration)
				.relative(Accessor.create(sprite.getPositionX.bind(sprite), sprite.setPositionX.bind(sprite)), 0)
				.relative(Accessor.create(sprite.getPositionY.bind(sprite), sprite.setPositionY.bind(sprite)), spriteBoardSize.height)
		);
	}

	doTestTimeline2()
	{
		const duration = 2000;
		const spriteCount = 3;
		const distanceX = 100;
		const distanceY = 100;

		let sprites = new Array(spriteCount);
		for(let i = 0; i < spriteCount; ++i) {
			sprites[i] = this.addImage(imageName, new Point(spriteBoardStart.x + 100.0 + imageSize.width * 1.5 * i, spriteBoardStart.y + spriteBoardSize.height / 2));
		}
		sprites[1].setScale(new Scale(0.5, 0.5));

		const timeline = this._tweenList.timeline();
		let t = 0;

		timeline.append(
			timeline.tween()
				.duration(duration)
				.ease(ElasticEase.easeIn())
				.relative(Accessor.create(sprites[0].getPositionX.bind(sprites[0]), sprites[0].setPositionX.bind(sprites[0])), -distanceX)
				.relative(Accessor.create(sprites[0].getPositionY.bind(sprites[0]), sprites[0].setPositionY.bind(sprites[0])), 0)
		);

		const timeline2 = timeline.timeline();

		timeline2.append(
			timeline2.tween()
				.duration(duration)
				.ease(SineEase.easeIn())
				.target(Accessor.create(sprites[1].getRotation.bind(sprites[1]), sprites[1].setRotation.bind(sprites[1])), 360)
		);
		timeline2.prepend(
			timeline2.tween()
				.duration(duration)
				.ease(QuintEase.easeIn())
				.target(Accessor.create(sprites[1].getScaleX.bind(sprites[1]), sprites[1].setScaleX.bind(sprites[1])), 1)
				.target(Accessor.create(sprites[1].getScaleY.bind(sprites[1]), sprites[1].setScaleY.bind(sprites[1])), 1)
		);
		t = timeline.append(
			timeline.tween()
				.duration(duration)
				.ease(CubicEase.easeIn())
				.relative(Accessor.create(sprites[2].getPositionX.bind(sprites[2]), sprites[2].setPositionX.bind(sprites[2])), distanceX)
				.relative(Accessor.create(sprites[2].getPositionY.bind(sprites[2]), sprites[2].setPositionY.bind(sprites[2])), 0)
		);
		timeline.insert(
			t,
			timeline2
		);

		t = timeline.append(
			timeline.tween()
				.duration(duration)
				.ease(BounceEase.easeOut())
				.relative(Accessor.create(sprites[0].getPositionX.bind(sprites[0]), sprites[0].setPositionX.bind(sprites[0])), 0)
				.relative(Accessor.create(sprites[0].getPositionY.bind(sprites[0]), sprites[0].setPositionY.bind(sprites[0])), -distanceY)
		);
		timeline.setAt(t,
			timeline.tween()
				.duration(duration)
				.ease(BounceEase.easeOut())
				.relative(Accessor.create(sprites[1].getPositionX.bind(sprites[1]), sprites[1].setPositionX.bind(sprites[1])), 0)
				.relative(Accessor.create(sprites[1].getPositionY.bind(sprites[1]), sprites[1].setPositionY.bind(sprites[1])), distanceY)
		);
		timeline.setAt(t,
			timeline.tween()
				.duration(duration)
				.ease(BounceEase.easeOut())
				.relative(Accessor.create(sprites[2].getPositionX.bind(sprites[2]), sprites[2].setPositionX.bind(sprites[2])), 0)
				.relative(Accessor.create(sprites[2].getPositionY.bind(sprites[2]), sprites[2].setPositionY.bind(sprites[2])), -distanceY)
		);

		timeline
			.repeat(tweenRepeatInfinitely)
			.yoyo(true)
		;
	}

}

TestBedRegister.getInstance().registerItem("Tween", ()=>new TestCase_Tween());
