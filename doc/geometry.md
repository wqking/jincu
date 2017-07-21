# Geometry classes

## Class Vector

`Vector` is the class for both `Point` and `Scale`.

### Member methods

```javascript
constructor()
constructor(x, y)
constructor(x, y, z)
```
The constructor. Note there is a 3D version but z is not used actually.

```javascript
assignFrom(other)
```
Assign all properties from `other`.  
`other`: another Vector.

```javascript
clone()
```
Return a new Vector object with properties copied from `this`.

```javascript
equals(other)
```
Return when `this` equals to `other`, compared property by property.

### Member properties

'x': the position x.  
'y': the position y.  

```javascript
let Point = Vector;
let Scale = Vector;
```
`Point` and `Scale` are aliases of Vector.


## Class Size
`Size` holds 2D dimensions: with and height.

### Member methods

```javascript
constructor()
constructor(width, height)
```
The constructor.

```javascript
assignFrom(other)
```
Assign all properties from `other`.  
`other`: another Size.

```javascript
clone()
```
Return a new Size object with properties copied from `this`.

```javascript
equals(other)
```
Return when `this` equals to `other`, compared property by property.

### Member properties

'width': the width.  
'height': the height.  


## Class Rect

`Rect` represents a rectangle using x, y, width and height.

### Member methods

```javascript
constructor()
constructor(x, y, width, height)
```
The constructor.

```javascript
assignFrom(other)
```
Assign all properties from `other`.  
`other`: another Rect.

```javascript
clone()
```
Return a new Rect object with properties copied from `this`.

```javascript
equals(other)
```
Return when `this` equals to `other`, compared property by property.

### Member properties

'x': the position x.  
'y': the position y.  
'width': the width.  
'height': the height.  

