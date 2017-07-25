# Scene management

A scene is virtually a stage that manages and renders all entities on the screen. A game can have multiple scenes, such as cover/logo scene, main menu scene, main game play scene, level result scene, etc.

## Class SceneManager

SceneManager is used to manage the underlying scenes.  
To get the SceneManager instance,  
```javascript
Application.getInstance().getSceneManager()
```

### Member methods

```javascript
getCurrentScene()
```
Return the current scene object.

```javascript
switchScene(scene)
switchScene(scene, transition)
```
Switch current scene to `scene`.  
**scene**: the scene object to switch to.  
**transition**: the transition used to switch the scene.

## Class Scene

Class `Scene` is the base class of all scenes. Your new scenes should inherite from `Scene`.

### Member methods

```javascript
getPrimaryCamera()
```
Return the primary camera. A scene always creates a primary camera automatically. The primary camera's viewport is always the full canvas.


```javascript
getTweenList()
```
Return the tween list object. A scene contains its own tween list and the scene ticks the tween list automatically.

```javascript
addEntity(entity)
```
Add `entity` to the scene, and return the entity object.  
All entities on a scene should be added via this method.

```javascript
removeEntity(entity)
```
Remove 'entity' from the scene.

```javascript
doOnEnter()
```
Virtual method. It's called when the scene becomes active and visible.  
This is the place to initialize the whole scene. Your new scene should always override this method and initialize all entities there.

```javascript
doOnExit()
```
Virtual method. It's called when the scene becomes inactive and invisible.
This is the place to destroy the whole scene. Your new scene should always override this method and do cleanup work there.  
Note you don't need to remove entities. The `Scene` will do it.

