# Start your first game

The best way to start is to see the code in testapp/src/index.js and testapp/public/index.html. They are the entry.

## Prepare the container DIV in the HTML file.

```html
	<div id="canvasContainer" style="width:900px;height:600px;background-color:#eeeeee;margin:auto auto">
	</div>
```
You can use any CSS style on the DIV. Jincu uses the entire DIV area as the canvas.

## The application entry code in the JavaScript file.

```javascript
import { Application, Color } from 'jincu';
let app = new Application({
	container: '#canvasContainer',
	backgroundColor: Color.fromValue(0xffeeeeee),
	entryScene: new MyFirstScene(),
	fps: 30,
});
app.run();
```
Just new an Application then run.  
The Application constructor accepts a configure object.  
Available configure object properties:  
container -- the id of the container DIV.  
backgroundColor -- the default backgroundColor. The render engine will fill the canvas with the color.  
entryScene -- the scene object to start with.  
fps -- the desired frame rate (frame per second).  

## Prepare MyFirstScene

```javascript
import { Scene } from 'jincu';
import backgroundImageName from './resources/matchthree/background.png';

class MyFirstScene extends Scene
{
	doOnEnter()
	{
		this.addEntity(
			(new Entity())
			.addComponent(new ComponentTransform(new Point(-700, -230), new Scale(2.2, 2.2)))
			.addComponent(createAndLoadImageComponent(backgroundImageName))
		);
	}
}

```
Now we have a simple MyFirstScene. It shows an image.

Now you can build and run the code to see what happens.
