import {
	Entity,
	ComponentAnchor,
	ComponentRendererTouchHandler,
	ComponentTransform,
	ComponentFrameAnimation,
	ComponentContainerRender,
	Color,
	Application,
	Atlas,
	RenderAnchor,
	Point,
	Size,
	Events,
	createAtlasRenderComponent,
	createAndLoadTextComponent,
	createRectRenderComponent,
	buildFrameAnimationDataFromAtlas,
	FrameAnimationSetData
} from 'jincu';

import uiAtlasImage from './resources/ui_atlas.png';
import uiAtlasText from './resources/ui_atlas.txt';

export const defaultButtonSize = new Size(100, 30);

class UiUtil
{
	static createBackButton(onClick)
	{
		return (new Entity())
			.addComponent(new ComponentTransform(new Point(40, 40)))
			.addComponent(new ComponentAnchor(RenderAnchor.center))
			.addComponent(createAtlasRenderComponent(Application.getInstance().getResourceManager().getAtlas({
				image: uiAtlasImage,
				text: uiAtlasText
			}, Atlas.formats.spritePackText), "back_button"))
			.addComponent((new ComponentRendererTouchHandler()).addOnTouch(Events.touchPressed, onClick)
		);
	}

	static createButton(text, position, onClick, size)
	{
		size = size || defaultButtonSize;
		return (new Entity())
			.addComponent(new ComponentTransform(position))
			.addComponent(new ComponentAnchor(RenderAnchor.center))
			.addComponent(new ComponentContainerRender()
				.add(createRectRenderComponent(Color.fromValue(0xffeeee77), size))
				.add(createAndLoadTextComponent(text, Application.getInstance().getResourceManager().getFont({ size: 16 }), Color.blue))
			)
			.addComponent((new ComponentRendererTouchHandler()).addOnTouch(Events.touchPressed, onClick)
		);
	}

	static createAnimation(params)
	{
		const component = new ComponentFrameAnimation();
		Application.getInstance().getResourceManager().getAtlas(params, Atlas.formats.spritePackText, ()=>{
			const data = new FrameAnimationSetData();
			buildFrameAnimationDataFromAtlas(data, Application.getInstance().getResourceManager().getAtlas(params, Atlas.formats.spritePackText));
			component.setAnimationSetData(data);
			component.getTween().repeat(-1).timeScale(0.2);
		});
		return component;
	}

}

export { UiUtil };
