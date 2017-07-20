import {
	Point,
	Color,
	Application,
	ComponentAnchor,
	ComponentRendererTouchHandler,
	ComponentTransform,
	Events,
	Entity,
	RenderAnchor,
	createAndLoadTextComponent,
	createAndLoadImageComponent
} from 'jincu';

import { TestCase } from '../TestCase.js';
import { TestBedRegister } from '../TestBed.js';

import catImage from '../../resources/testbed/cat.png';

class TestCase_Flip extends TestCase
{
	doInitialize()
	{
		this.doInitializeText(new Point(100, 30));
		this.doInitializeImage(new Point(100, 150));
	}

	doInitializeText(position)
	{
		const x = position.x;
		const y = position.y;
		const xDelta = 400;
		const yDelta = 60;
		const color = Color.blue;
		const font = Application.getInstance().getResourceManager().getFont({ size: 32 });
		this.getScene().addEntity(
			(new Entity())
			.addComponent(new ComponentTransform(new Point(x, y)))
			.addComponent(new ComponentAnchor(RenderAnchor.leftTop))
			.addComponent(createAndLoadTextComponent("text LeftTop no flip", font, color))
			.addComponent(new ComponentRendererTouchHandler().addOnTouch(Events.touchPressed, ()=>{
				console.log("clicked: text LeftTop no flip");
				})
			)
		);

		this.getScene().addEntity(
			(new Entity())
			.addComponent(new ComponentTransform(new Point(x, y + yDelta)))
			.addComponent(new ComponentAnchor(RenderAnchor.leftTop).setFlipX(true))
			.addComponent(createAndLoadTextComponent("text LeftTop flip x", font, color))
			.addComponent(new ComponentRendererTouchHandler().addOnTouch(Events.touchPressed, ()=>{
				console.log("clicked: text LeftTop flip x");
				})
			)
		);

		this.getScene().addEntity(
			(new Entity())
			.addComponent(new ComponentTransform(new Point(x + xDelta, y)))
			.addComponent(new ComponentAnchor(RenderAnchor.leftTop).setFlipY(true))
			.addComponent(createAndLoadTextComponent("text LeftTop flip y", font, color))
			.addComponent(new ComponentRendererTouchHandler().addOnTouch(Events.touchPressed, ()=>{
				console.log("clicked: text LeftTop flip y");
				})
			)
		);

		this.getScene().addEntity(
			(new Entity())
			.addComponent(new ComponentTransform(new Point(x + xDelta, y + yDelta)))
			.addComponent(new ComponentAnchor(RenderAnchor.leftTop).setFlipX(true).setFlipY(true))
			.addComponent(createAndLoadTextComponent("text LeftTop flip x/y", font, color))
			.addComponent(new ComponentRendererTouchHandler().addOnTouch(Events.touchPressed, ()=>{
				console.log("clicked: text LeftTop flip x/y");
				})
			)
		);

	}

	doInitializeImage(position)
	{
		const imageName = catImage;
		const x = position.x;
		const y = position.y;
		const xDelta = 150;
		const yDelta = 150;
		this.getScene().addEntity(
			(new Entity())
			.addComponent(new ComponentTransform(new Point(x, y)))
			.addComponent(new ComponentAnchor(RenderAnchor.leftTop))
			.addComponent(createAndLoadImageComponent(imageName))
			.addComponent(new ComponentRendererTouchHandler().addOnTouch(Events.touchPressed, ()=>{
				console.log("clicked: image LeftTop no flip");
				})
			)
		);

		this.getScene().addEntity(
			(new Entity())
			.addComponent(new ComponentTransform(new Point(x, y + yDelta)))
			.addComponent(new ComponentAnchor(RenderAnchor.leftTop).setFlipX(true))
			.addComponent(createAndLoadImageComponent(imageName))
			.addComponent(new ComponentRendererTouchHandler().addOnTouch(Events.touchPressed, ()=>{
				console.log("clicked: image LeftTop flip x");
				})
			)
		);

		this.getScene().addEntity(
			(new Entity())
			.addComponent(new ComponentTransform(new Point(x + xDelta, y)))
			.addComponent(new ComponentAnchor(RenderAnchor.leftTop).setFlipY(true))
			.addComponent(createAndLoadImageComponent(imageName))
			.addComponent(new ComponentRendererTouchHandler().addOnTouch(Events.touchPressed, ()=>{
				console.log("clicked: image LeftTop flip y");
				})
			)
		);

		this.getScene().addEntity(
			(new Entity())
			.addComponent(new ComponentTransform(new Point(x + xDelta, y + yDelta)))
			.addComponent(new ComponentAnchor(RenderAnchor.leftTop).setFlipX(true).setFlipY(true))
			.addComponent(createAndLoadImageComponent(imageName))
			.addComponent(new ComponentRendererTouchHandler().addOnTouch(Events.touchPressed, ()=>{
				console.log("clicked: image LeftTop flip x/y");
				})
			)
		);

	}

}

TestBedRegister.getInstance().registerItem("Flip", ()=>new TestCase_Flip());
