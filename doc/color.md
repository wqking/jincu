# Color

Jincu uses its own device independent color system, which is the class `Color`.

## Class Color

### Member methods

```javascript
static fromRGB(r, g, b)
```
Static factory function, returns a Color object from r (red channel), g (green channel), and b (blue channel). Each channel is an integer within [0, 255].

```javascript
static fromRGBA(r, g, b, a)
```
Static factory function, returns a Color object from r (red channel), g (green channel), b (blue channel), and a (alpha channel). Each channel is an integer within [0, 255]. Alpha 255 is opaque, 0 is transparent.

```javascript
static fromValue(v)
```
Static factory function, returns a Color object from the value. v is an integer in format 0xAARRGGBB.

```javascript
constructor(r, g, b, a)
```
The constructor. Above factory functions should be prefered over the constructor.

### Predefined color constants

```javascript
Color.white = Color.fromRGB(255, 255, 255);
Color.black = Color.fromRGB(0, 0, 0);
Color.blue = Color.fromRGB(0, 0, 255);
Color.red = Color.fromRGB(255, 0, 0);
Color.green = Color.fromRGB(0, 255, 0);
Color.yello = Color.fromRGB(255, 255, 0);
Color.purple = Color.fromRGB(80, 0, 80);
```
For example, `let myColor = Color.blue;` will assign blue to myColor.
