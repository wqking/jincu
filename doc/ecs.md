# Entity Component System

One of the core concept in Jincu is Entity Component System (the abbreviation is ECS). Unlike the traditional a chunk Actor class does all work, ECS splits tasks to components which is more modularized.

## Class Entity

An entity does nothing but holds a bunch of components. An entity doesn't have properties like positions, textures, or anything else.  

### Member methods

```javascript
addComponent(component)
```
Add `component` to the entity and return the component object. If there is already a component with same type of `component`, the existing component will be replaced.

```javascript
removeComponent(component)
```
Remove `component` from the entity.

```javascript
getComponent(type)
```
Return component of `type`. If the entity doesn't hold any this type component, `null` is returned.

## Class Component

`Component` is the base class of all components. Your new components should always inherit from `Component`.

### Member methods

```javascript
constructor(type)
```
The constructor. All inherited components must call `super(type)` with a unique string `type`. The `type` is used to identify the component.

```javascript
getType()
```
Return the component type.

```javascript
getEntity()
```
Return the owner entity, or `null` if the component is not added to any entity yet.  
A component can only belongs to one entity. If a component is added to another entity, it will detach itself from the previous entity, if any.

```javascript
doAfterSetEntity()
```
Virtual method. It's called after an entity or null entity is set.

```javascript
doDidActivate()
```
Virtual method. It's called after the component is available to use. The owner entity is guaranteed valid.  
It's the place to initialize any component specified work.

```javascript
doWillDeactivate()
```
Virtual method. It's called when the component will be unavailable to use. The owner entity is guaranteed valid.  
It's the place to cleanup any component specified work.

