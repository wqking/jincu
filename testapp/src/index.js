//import registerServiceWorker from './registerServiceWorker';
import jQuery from 'jquery';

import { Application, Size, Color } from 'jincu';
import { SceneLogo } from './SceneLogo.js';
import { SceneTestBed } from './testbed/SceneTestBed.js';

//registerServiceWorker();

let app = new Application({
	container: '#canvasContainer',
	backgroundColor: Color.fromValue(0xffeeeeee),
	entryScene: new SceneLogo(true),
	//targetViewSize: new Size(900, 600),
	fps: 30,
});
app.run();

