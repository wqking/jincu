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
	ComponentAnchor,
	Accessor,
	Atlas,
	Color,
	QuadEase,
	LinearEase,
	TransitionMoveIn
} from 'jincu';

import { SceneMenu, MenuRegister } from './SceneMenu.js';

import chessAtlasImage from './resources/matchthree/chess_atlas.png';
import chessAtlasText from './resources/matchthree/chess_atlas.txt';
import backgroundImageName from './resources/matchthree/background.png';

const logoItemList = [
	{ chess: '1', text: "J", color: Color.blue },
	{ chess: '2', text: "I", color: Color.green },
	{ chess: '3', text: "N", color: Color.purple },
	{ chess: '4', text: "C", color: Color.red },
	{ chess: '5', text: "U", color: Color.fromValue(0xffdddd00) },
	{ chess: '1', text: "", color: Color.white },
	{ chess: '5', text: "G", color: Color.fromValue(0xffdddd00) },
	{ chess: '4', text: "A", color: Color.blue },
	{ chess: '3', text: "M", color: Color.fromValue(0xff00dddd) },
	{ chess: '2', text: "E", color: Color.fromValue(0xffdd00dd) },
	{ chess: '2', text: "S", color: Color.purple },
];

function createChessRender(chess)
{
	const resourceManager = Application.getInstance().getResourceManager();
	return createAtlasRenderComponent(resourceManager.getAtlas({
		text: chessAtlasText,
		image: chessAtlasImage
	}, Atlas.formats.spritePackText), chess);
}

class SceneLogo extends Scene
{
	constructor(showProgressBar)
	{
		super();
		
		this._showProgressBar = showProgressBar;
	}

	doOnEnter()
	{
		const resourceManager = Application.getInstance().getResourceManager();
		const itemCount = logoItemList.length;
		const viewWidth = this.getPrimaryCamera().getWorldSize().width;
		const viewHeight = this.getPrimaryCamera().getWorldSize().height;
		const xSpace = 40;
		const ySize = xSpace;
		const startX = viewWidth / 2 - (itemCount -1) * xSpace / 2;
		const firstTweenDuration = 400;

		this.addEntity(
			(new Entity())
				.addComponent(new ComponentTransform(new Point(0, 0), new Scale(3.25, 3.25)))
				.addComponent(createAndLoadImageComponent(backgroundImageName))
		);

		const timeline = this.getTweenList().timeline();
		timeline.onComplete(this._doExitLogo.bind(this));

		let x = startX - xSpace;
		let delay = 0;

		for(let i = 0; i < itemCount; ++i) {
			x += xSpace;

			const item = logoItemList[i];

			if(item.text.length === 0) {
				continue;
			}

			const entity = this.addEntity(
				(new Entity())
					.addComponent(new ComponentTransform(new Point(x, -ySize)))
					.addComponent(new ComponentAnchor(RenderAnchor.center))
					.addComponent(createChessRender(item.chess))
				);

			const transform = entity.getComponent(Component.types.transform);
			const accessor = Accessor.create(transform.getPositionY.bind(transform), transform.setPositionY.bind(transform));

			timeline.setAt(delay,
				timeline.tween()
					.duration(firstTweenDuration)
					.ease(QuadEase.easeOut())
					.target(accessor, viewHeight / 2 + 100)
					.onComplete(() => {
						entity.addComponent(createAndLoadTextComponent(item.text, resourceManager.getFont(), item.color));
						}
					)
			);

			timeline.setAt(delay + firstTweenDuration,
				timeline.tween()
					.duration(300)
					.ease(QuadEase.easeOut())
					.target(accessor, viewHeight / 2)
			);

			delay += 100;
		}

		if(this._showProgressBar) {
			const progressBarWidth = 600;
			const progressBarHeight = 20;
			const startPosition = new Point(viewWidth / 2 - progressBarWidth / 2, viewHeight - progressBarHeight - 20);

			const progressBarEntity = this.addEntity(
				(new Entity())
					.addComponent(new ComponentTransform(startPosition))
					.addComponent(new ComponentAnchor(RenderAnchor.hLeft | RenderAnchor.vCenter))
					.addComponent(createRectRenderComponent(Color.fromValue(0x770000aa), new Size(progressBarWidth, progressBarHeight)))
				);
			const chessEntity = this.addEntity(
				(new Entity())
					.addComponent(new ComponentTransform(startPosition))
					.addComponent(new ComponentAnchor(RenderAnchor.center))
					.addComponent(createChessRender('4'))
			);

			const rectTransform = progressBarEntity.getComponent(Component.types.transform);
			rectTransform.setScale(new Scale(0, 1));
			const transform = chessEntity.getComponent(Component.types.transform);
			timeline.setAt(0,
				timeline.tween()
					.duration(timeline.getDuration())
					.ease(LinearEase.easeIn())
					.target(Accessor.create(rectTransform.getScaleX.bind(rectTransform), rectTransform.setScaleX.bind(rectTransform)), 1)
					.target(Accessor.create(transform.getPositionX.bind(transform), transform.setPositionX.bind(transform)), startPosition.x + progressBarWidth)
			);
		}

		timeline.append(timeline.tween().duration(1000));
	}

	_doExitLogo()
	{
		Application.getInstance().getSceneManager().switchScene(new SceneMenu());
	}

}

export { SceneLogo };

MenuRegister.getInstance().registerItem("about", 9999999, ()=>{
		Application.getInstance().getSceneManager().switchScene(new SceneLogo(false), new TransitionMoveIn(500, new Point(-1, -1)));
	},
	Color.fromValue(0xffaaaaff)
);
