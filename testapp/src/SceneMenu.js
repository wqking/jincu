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

import chessAtlasImage from './resources/matchthree/chess_atlas.png';
import chessAtlasText from './resources/matchthree/chess_atlas.txt';
import backgroundImageName from './resources/matchthree/background.png';

class MenuRegister
{
	static getInstance()
	{
		return MenuRegister._instance;
	}
	
	constructor()
	{
		this._itemList = [];
	}

	registerItem(caption, order, callback, backgroundColor)
	{
		this._itemList.push({
			caption: caption,
			order: order,
			callback: callback,
			backgroundColor: backgroundColor || Color.fromValue(0xffeeee77)
		});
	}
	
	getSortedItemList()
	{
		this._itemList.sort((a, b)=>{ return a.order - b.order; });
		return this._itemList;
	}

}

MenuRegister._instance = new MenuRegister();

export { MenuRegister };


class SceneMenu extends Scene
{
	doOnEnter()
	{
		const viewWidth = this.getPrimaryCamera().getWorldSize().width;
		const viewHeight = this.getPrimaryCamera().getWorldSize().height;
		const tileSize = new Size(400, 80);
		const ySpace = 40;

		this.addEntity(
			(new Entity())
			.addComponent(new ComponentTransform(new Point(-700, -230), new Scale(2.2, 2.2)))
				.addComponent(createAndLoadImageComponent(backgroundImageName))
		);

		const itemList = MenuRegister.getInstance().getSortedItemList();
		const itemCount = itemList.length;
		const totalHeight = itemCount * tileSize.height + (itemCount - 1) * ySpace;
		const yStart = (viewHeight - totalHeight) / 2;
		const x = viewWidth / 2;

		for(let i = 0; i < itemCount; ++i) {
			const item = itemList[i];
			this.addEntity(
				(new Entity())
					.addComponent(new ComponentTransform())
					.addComponent(new ComponentLocalTransform(new Point(x, yStart + (tileSize.height + ySpace) * i)))
					.addComponent(new ComponentAnchor(RenderAnchor.center))
					.addComponent(new ComponentContainerRender()
						.add(createRectRenderComponent(item.backgroundColor, tileSize))
						.add(createAndLoadTextComponent(item.caption, Application.getInstance().getResourceManager().getFont({ size: 72 }), Color.blue))
					)
					.addComponent(new ComponentRendererTouchHandler().addOnTouch(Events.touchPressed, ()=>{
						item.callback();
					}))
			);
		}
	}
}

export { SceneMenu };

