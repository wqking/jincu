import { Application, Color } from 'jincu';
import { SceneLogo } from './SceneLogo.js';
export { SceneTestBed } from './testbed/SceneTestBed.js';

let app = new Application({
	container: '#canvasContainer',
	backgroundColor: Color.fromValue(0xffeeeeee),
	entryScene: new SceneLogo(true),
	//targetViewSize: new Size(900, 600),
	fps: 30,
});
app.run();

