import {
	Point,
	Color,
	Application,
	Component,
	ComponentAnchor,
	ComponentRendererTouchHandler,
	ComponentTransform,
	Events,
	Entity,
	EntityUtil,
	RenderAnchor,
	createAndLoadTextComponent,
	createAtlasRenderComponent,
	Atlas,
	Keyboard
} from 'jincu';

import { TestCase } from '../TestCase.js';
import { TestBedRegister } from '../TestBed.js';
import { UiUtil } from '../../UiUtil.js';

import catImage from '../../resources/testbed/cat.png';
import atlasRunningManImage from '../../resources/testbed/animation_running_man.png';
import atlasRunningManText from '../../resources/testbed/animation_running_man.txt';

class JumperAiComponent extends Component
{
	constructor()
	{
		super(JumperAiComponent._type);
		
		this._state = JumperAiComponent.states.idle;
		this._transform = null;
		this._cachedPosition = new Point();
		
		this._velocity = 0;
		this._acceleration = 0;
		
		this._onUpdate = this._onUpdate.bind(this);
		this._onTouchPressed = this._onTouchPressed.bind(this);
	}

	// override
	doAfterSetEntity()
	{
		this.changeState(JumperAiComponent.states.idle);
	}

	// override
	doDidActivate()
	{
		Application.getInstance().getEventQueue().addListener(Events.update, this._onUpdate);
		Application.getInstance().getEventQueue().addListener(Events.touchPressed, this._onTouchPressed);
	}
	
	// override
	doWillDeactivate()
	{
		Application.getInstance().getEventQueue().removeListener(Events.update, this._onUpdate);
		Application.getInstance().getEventQueue().removeListener(Events.touchPressed, this._onTouchPressed);
	}
	
	changeState(state)
	{
		this._transform = EntityUtil.getComponentByTypeFromComponent(Component.types.transform, this);
		this._state = state;
		if(! this._transform) {
			return;
		}
		
		switch(this._state) {
		case JumperAiComponent.states.idle:
			this._cachedPosition.x = JumperAiComponent._groundX;
			this._cachedPosition.y = JumperAiComponent._groundY;
			this._transform.setPosition(this._cachedPosition);
			break;

		case JumperAiComponent.states.jumping:
			this._velocity = JumperAiComponent._initialVelocity;
			this._acceleration = JumperAiComponent._initialAcceleration;
			break;
		}
	}

	_onUpdate()
	{
		switch(this._state) {
		case JumperAiComponent.states.idle:
			if(Keyboard.getInstance().isKeyJustPressed(Keyboard.keyCodes.space)) {
				this.changeState(JumperAiComponent.states.jumping);
			}
			break;

		case JumperAiComponent.states.jumping:
			this._velocity += this._acceleration;
			if(this._velocity > JumperAiComponent._maxVelocity) {
				this._velocity = JumperAiComponent._maxVelocity;
			}
			if(this._velocity < -JumperAiComponent._maxVelocity) {
				this._velocity = -JumperAiComponent._maxVelocity;
			}
			this._cachedPosition.assignFrom(this._transform.getPosition());
			this._cachedPosition.y += this._velocity;
			this._transform.setPosition(this._cachedPosition);
			if(this._cachedPosition.y >= JumperAiComponent._groundY) {
				this.changeState(JumperAiComponent.states.idle);
			}
			break;
		}
	}
	
	_onTouchPressed()
	{
		switch(this._state) {
		case JumperAiComponent.states.idle:
			this.changeState(JumperAiComponent.states.jumping);
			break;

		case JumperAiComponent.states.jumping:
			break;
		}
	}

}

JumperAiComponent._type = 'jumperAi';
JumperAiComponent._groundX= 400;
JumperAiComponent._groundY = 400;
JumperAiComponent._initialVelocity = -40;
JumperAiComponent._initialAcceleration = 3;
JumperAiComponent._maxVelocity = Math.abs(JumperAiComponent._initialVelocity);
JumperAiComponent.states = {
	idle: 1,
	jumping: 2
};


class TestCase_Jumper extends TestCase
{
	doInitialize()
	{
		const color = Color.blue;
		const font = Application.getInstance().getResourceManager().getFont({ size: 16 });
		this.getScene().addEntity(
			(new Entity())
			.addComponent(new ComponentTransform(new Point(400, 30)))
			.addComponent(new ComponentAnchor(RenderAnchor.center))
			.addComponent(createAndLoadTextComponent("Press Space or click to jump", font, color))
		);

		const atlasParams = {
			image: atlasRunningManImage,
			text: atlasRunningManText
		};
		this.getScene().addEntity(
			(new Entity())
			.addComponent(new ComponentTransform())
			.addComponent(new ComponentAnchor(RenderAnchor.hCenter | RenderAnchor.bottom))
			.addComponent(createAtlasRenderComponent(Application.getInstance().getResourceManager().getAtlas(atlasParams, Atlas.formats.spritePackText)))
			.addComponent(UiUtil.createAnimation(atlasParams))
			.addComponent(new JumperAiComponent())
		);
	}

}

TestBedRegister.getInstance().registerItem("Jumper", ()=>new TestCase_Jumper());
