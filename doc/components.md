# Built in components

Jincu has several built-in components.  

## Build-in component types

`Component.types.render`: the component to render the entity.  
`Component.types.transform`: the global transform of the render.  
`Component.types.localTransform`: the local transform.  
`Component.types.touchHandler`: the touch handler.  
`Component.types.anchor`: the anchor component. An anchor component makes it easy to align an entity.  
`Component.types.camera`: the camera component.

## Class ComponentRender

`ComponentRender` is the base class of all render components.

### Member methods

```javascript
doDraw(renderContext)
```
Abstract virtual method. It's called to draw the entity on screen.

```javascript
doGetSize()
```
Abstract virtual method. Return a `Size` object of the visual object.  
This method is called to measure the object dimension.  

## Class ComponentRenderCommon

`ComponentRenderCommon` is the default implementation of ComponentRender. It's used to draw image, text, and atlas.  
It has several alias names:  
```javascript
const ComponentImageRender = ComponentRenderCommon;
const ComponentAtlasRender = ComponentRenderCommon;
const ComponentTextRender = ComponentRenderCommon;
const ComponentRectender = ComponentRenderCommon;
```

## Global functions to create ComponentRenderCommon

Instead of create components of ComponentRenderCommon directly, there are several shortcut functions to ease the component creation.

```javascript
function createAndLoadImageComponent(resourceName)
```
Create and return a ComponentImageRender object. The returned object can be added to entity directly.  
`resourceName`: the image URL.

```javascript
function createAtlasRenderComponent(atlas)
function createAtlasRenderComponent(atlas, name)
```
Create and return a ComponentAtlasRender object.    
`atlas`: the `Atlas` object.  
`name`: the name of the frame on the atlas. If it's omitted, the first frame is used.

```javascript
createAndLoadTextComponent(text, font, color)
```
Create and return a ComponentTextRender object.  
`text`: the text string to draw.
`font`: the `Font` object. A font can be got by call `Application.getInstance().getResourceManager().getFont()`.  
`color`: The `Color` object.  

```javascript
function createRectRenderComponent(color, size)
```
Create and return a ComponentRectender object. The returned object can be added to entity directly.  
`color`: The `Color` object.  
`size`: The `Size` object.  

## Class ComponentTransformBase

`ComponentTransformBase` is the base class of transform and local transform components.  
A transform component is the used in the global canvas space. All visible entities must have a transform, no matter it's a parent or child.  
A local transform is used for the parent entity space. So a local transform is used to construct the traditional scene graph.  

### Member methods

All member methods in `ComponentTransformBase` are also available in `ComponentTransform` and `ComponentLocalTransform`.

```javascript
getPosition()
setPosition(position)
getPositionX()
setPositionX(x)
getPositionY()
setPositionY(y)
```
Get or set the position.  
`position`: a `Position` object which contains the properties of x and y.  
`x`: the position x.  
`y`: the position y.  

```javascript
getOrigin()
setOrigin(origin)
getOriginX()
setOriginX(origin)
getOriginY()
setOriginY(origin)
```
Get or set the origin. By default the entity origin is at (0, 0), you can change it with those functions. However, `ComponentAnchor` is a more convenient way to do so.
`origin`: a `Position` object which contains the properties of x and y.  
`x`: the origin x.  
`y`: the origin y.  

```javascript
getScale()
setScale(scale)
getScaleX()
setScaleX(x)
getScaleY()
setScaleY(y)
```
Get or set the scale.  
`scale`: a `Scale` object which contains the properties of x and y.  
`x`: the scale x.  
`y`: the scale y.  

```javascript
getRotation()
setRotation(rotation)
```
Get or set the rotation. The rotation is in degree.  
`rotation`: the rotation degree.

```javascript
isVisible()
setVisible(visible)
```
Check or set the visibility.  
`visible`: the boolean value.

```javascript
getZOrder()
setZOrder(zOrder)
```
Get or set the z order. z order can be positive or negative. The bigger z order the nearer to the users.  
`zOrder`: the z order value.


## Class ComponentTransform

### Member methods

```javascript
constructor(position, scale, visible)
```
The constructor.  
`position`: the `Position` object.  
`scale`: the `Scale` object.
`visible`: the boolean value.

```javascript
getCameraId()
setCameraId(cameraId)
```
Get or get the camera ID. The camera ID is an integer within [0, 31]. A camera has an integer mask with bit flags. If a camera has mask with 0x01, then all ComponentTransform with camera ID 0 are visible to the camera. There are maximum 32 cameras in the game.  
Unless you are willing to use the camera system extensively, usually you don't need care about the camera ID, the default will always work.


## Class ComponentLocalTransform

### Member methods

```javascript
constructor(position, scale, visible)
```
The constructor.  
`position`: the `Position` object.  
`scale`: the `Scale` object.
`visible`: the boolean value.

```javascript
getParent()
setParent(parent)
```
Get or set the parent. A parent is a local transform in another entity. After a local transform has a parent, it's position, scale and rotation are relative to its parent.  
`parent`: a `ComponentLocalTransform` object.

```javascript
getChildCount()
```
Return the number of children local transforms.

```javascript
getChildAt(index)
```
Return the child local transform at `index`.


## Class ComponentTouchHandler

`ComponentTouchHandler` is the base class of the touch (mouse input) handler component. An entity can receive touch events only if it has a component of ComponentTouchHandler.  

### Member methods

```javascript
addOnTouch(e, handler)
removeOnTouch(e, handler)
```
Add or remove a on touch callback.  
`e`: value of Events.touchMoved, Events.touchPressed, or Events.touchReleased.  
'handler': the callback function with prototype of 'function(e, worldPosition)'. The argument e is the event type, worldPosition is the position in the canvas space.


## Class ComponentRendererTouchHandler

`ComponentRendererTouchHandler` is the implementation of ComponentTouchHandler. It uses the render component dimension to detect touch.


## Class ComponentAnchor

`ComponentAnchor` is a component to align visible entity easily.

### Member methods

```javascript
constructor(anchor)
```
The constructor.  
`anchor`: a enumerator of predefined values. Below code shows the values.  
```javascript
export let RenderAnchor = {
	none: 0, // default alignment, left top

	hLeft: 0x01, // horizontal left
	hCenter: 0x02, // horizontal center
	hRight: 0x04, // horizontal right
	hMask: 0x0f,

	vTop: 0x10, // vertical top
	vCenter: 0x20, // vertical center
	vBottom: 0x40, // vertical bottom
	vMask: 0xf0,
};

RenderAnchor.leftTop = RenderAnchor.hLeft | RenderAnchor.vTop;
RenderAnchor.center = RenderAnchor.hCenter | RenderAnchor.vCenter;
RenderAnchor.rightTop = RenderAnchor.hRight | RenderAnchor.vTop;
```

```javascript
getAnchor()
setAnchor(renderAnchor)
```
Get or set the anchor.

```javascript
isFlipX()
setFlipX(flipX)
isFlipY()
setFlipY(flipY)
```
Check or set flip x and flip y. `flipX` and `flipY` are boolean values.


## Class ComponentAnimation

`ComponentAnimation` is the base class of animation component. However, your customized animation component doesn't need to inherit from ComponentAnimation. Jincu has very loose animation concept, or even to say, no animation concept at all. To do animation, just add a component with any type (no need to be Component.types.animation), then listen to Events.update, or just use a Tween, then do your animation.

### Member methods

```javascript
setAnimation(name)
```
Set the animation name to play with. An animation component may contain multiple animations.


## Class ComponentFrameAnimation

`ComponentFrameAnimation` is a frame based animation. It plays animation one frame after another.

### Member methods

```javascript
constructor(animationSetData)
```
The constructor.  
`animationSetData`: An object of FrameAnimationSetData. The animationSetData contains all data such as frame information, texture positions, and texture object.

```javascript
setAnimationSetData(animationSetData)
```
Set the animationSetData.

```javascript
getTween()
```
Return the underlying tween.  
ComponentFrameAnimation uses the tween to drive the animation, so to change how the animation is played, just change the tween.

