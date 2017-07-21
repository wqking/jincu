# Tweening library

In Jincu, the tweening library from (my cpgf library)[https://github.com/cpgf/cpgf] is converted from C++ to JavaScript. Tween is a power technique to make great animation.

## Main features

* Support many features that exist in some other widely used Flash tweening engines such as TweenMax. cpgf tween library supports repeat, yoyo, delay, repeat delay, backward, use frames, time scale, dynamical destination value (follow), and a lot of callbacks on initialization or complete.
* Support many easing functions. Now supports back, bounce, circle, cubic, elastic, exponent, linear, quad, quart, quint (strong), and sine. Adding new easing functions is a piece of cake!
* Support tweening getter and setter functions. With the powerful accessor library, we can tween a property via either direct address access, or getter and setter functions.
* Support both tween and timeline. A timeline is a “super” tween which can contains other tweens and timelines.


## Time unit in tween library
The tween library supports two kinds of timing mode
* One mode is frame based (useFrames(true)). In each tick the time is forwarded by 1. So a duration 10 will be finished in 10 frames, no matter what the frame rate is.
* The other mode is time based (useFrames(false)). In each tick the time is forwarded by frameDuration which passed in. Unlike a lot of other tweening engines, the tween library doesn't define the time unit. It all depends on how we use it. If we use seconds as duration, we should tick with seconds. If we use milliseconds as duration, so does we call tick().

**Canveat**: if the frameDuration is 0, the timeline will start any pending tweens immediately and cause weird behavior. So only use positive number as frameDuration. If your game frame rate is over 1000 that cause the frame duration is under 1 millisecond, you should use microsecond or even nanosecond which is never goes to zero.


## Class Getter, Setter, and Accessor

The `Accessor` as well as `Getter` and `Setter` are used by the tween library to read and write properties. All classes has a static method named 'create" to create an instance.

```javascript
//Getter
static create(value)
static create(value, key)
```
The parameter `value` can be one of below types:  
* null, undefined, boolean, number or string: the getter always returns `value` as is.
* function: the getter returns `value()`.
* object: the getter returns `value[key]`.

```javascript
//Getter
get()
```
Return the value from the getter.


```javascript
//Setter
static create(value)
static create(value, key)
```
The parameter `value` can be one of below types:  
* null, undefined, boolean, number or string: the setter does nothing.
* function: the setter calls `value(valueToSet)`.
* object: the setter calls `value[key] = valueToSet`.

```javascript
//Setter
set(value)
```
Set the value on the setter.


```javascript
//Accessor
static create(getter, setter)
```
Create an accessor from the getter and setter. `getter` is a Getter instance, and `setter` is a Setter instance.

```javascript
//Accessor
get()
set(value)
```
Get/set the underlying value.


## Common types, methods and parameters in both Tween and Timeline

Class Tween and Timeline share a lot of types, methods and parameters in common. Below lists the methods and parameters. Note either tween or timeline is also called a tweenable.

Parameter setting functions. All the parameter setting functions return `this` thus we can chain the calling such as myTween.backward(true).useFrames(true).

```javascript
backward(value)
```
Default is false. If the value is true, the tweenable will start from end to beginning. The function returns a reference to current object. So we can write chain functions as we did in above sample code.

```javascript
useFrames(value)
```
Default is false. If the value is true, the timing mode will be frame based. If the tweenable is in a master timeline, this value is always overwritten by the master timeline.

```javascript
delay(value)
```
Default is 0. Set the delay time. The tweenable will start after the value of time is elapsed.

```javascript
timeScale(value)
```
Default is 1. This value is multiplied to frame duration to change the tweenable speed. 1 is the normal speed, 0.5 is half speed, 2.0 is double speed, etc.

```javascript
repeat(value)
```
Default is 0. Set the number of times that the tweenable should repeat. -1 or tweenRepeatInfinitely repeats infinitely, 0 or tweenNoRepeat doesn't repeat.

```javascript
repeatDelay(value)
```
Default is 0. Set the delay time between repeats.

```javascript
yoyo(value);
```
Default is false. If the value is true, the tweenable will go back and forth, appearing to reverse every other cycle.

```javascript
onInitialize(value)
```
Set the callback which is called when the tweenable initializes. A tweenable will initialize after the delay time is elapsed and before the first tick.

```javascript
onComplete(value)
```
Set the callback which is called when the tweenable completes.

```javascript
onUpdate(value)
```
Set the callback which is called when the tweenable applied the new value in each tick.

```javascript
onRepeat(value)
```
Set the callback which is called when the tweenable is going to repeat.

Status query functions
```javascript
isRunning()
isPaused();
isCompleted()
isUseFrames()
isBackward()
isYoyo()
isRepeat()
isRepeatInfinitely()
getRepeatCount()
getRepeatDelay()
getDelay()
getTimeScale()
```

Functions
```javascript
tick(frameDuration);
```
Step forward the time.

```javascript
pause()
```
Pause the tweenable.

```javascript
resume()
```
Resume the tweenable.

```javascript
immediateTick()
```
Tick the tweenable immediately. This is usually called after the tweenable is setup and before starting. Calling this function will set the properties to the start value.

```javascript
restart();
```
Restart the tweenable. Any delay time is not included. So the tweenable will start without any delay time.

```javascript
restartWithDelay()
```
Restart the tweenable and include any delay time.

```javascript
getCurrentTime()
```
Get current elapsed time, not including delay time or any repeat.

```javascript
setCurrentTime(value)
```
Set current elapsed time, not including delay time or any repeat. In next tick, the tweenable will update from the new time.

```javascript
getTotalTime()
```
Get overall elapsed time, not including delay time, but include repeat and repeat delay time.  
If the tweenable is repeating infinitely, the return value is meaningless.

```javascript
setTotalTime(value)
```
Set overall elapsed time, not including delay time, but include repeat and repeat delay time.  
If the tweenable is repeating infinitely, setting the total time is undefined behavor.

```javascript
getCurrentProgress()
```
Get current elapsed progress, not including delay time or any repeat. This is same as  
`return getCurrentTime() / getDuration();`  
The return value is always between [0, 1].

```javascript
setCurrentProgress(value)
```
Set current elapsed progress, not including delay time or any repeat. This is same as  
`setCurrentTime(value * getDuration());`  
The value should be always between [0, 1]. If the value is smaller than 0, 0 will be used. If the value is larger than 1, 1 will be used.

```javascript
getTotalProgress()
```
Get overall elapsed progress, not including delay time, but include repeat and repeat delay time. This is same as  
`return getTotalTime() / getTotalDuration();`  
The return value is always between [0, 1].  
If the tweenable is repeating infinitely, the return value is meaningless.

```javascript
setTotalProgress(value)
```
Set overall elapsed progress, not including delay time, but include repeat and repeat delay time. This is same as  
`setTotalTime()(value * getTotalDuration());`  
The value should be always between [0, 1]. If the value is smaller than 0, 0 will be used. If the value is larger than 1, 1 will be used.  
If the tweenable is repeating infinitely, setting the total progress is undefined behavor.

```javascript
getDuration()
```
Get the duration of the tweenable. The duration doesn't include any delay or repeat.

```javascript
getTotalDuration()
```
Get the total duration of the tweenable. The total duration doesn't include any delay, but include repeat and repeat delay time.  
If the tweenable is repeating infinitely, the return value is meaningless.


## Tween special methods and parameters

Parameter setting functions

```javascript
ease(ease);
```
Set the ease function. Default is LinearEase.ease().

```javascript
duration(durationTime);
```
Set the duration time. The duration doesn't include any delay time or repeat delay.

Functions

```javascript
target(accessor, toValue)
target(accessor, fromValue, toValue)
```
Add a property to tween on.  
accessor: An accessor that the tween uses to get and set value.  
fromValue: Specify the beginning value. Otherwise the Tween will use the property value at the time when the tween starts.  
toValue: The target value. The property value will be tweened to the target value.  

```javascript
relative(accessor, relativeValue)
relative(accessor, fromValue, relativeValue)
```
Similar as the `target` functions. The `relative` functions add a property to tween on. Instead of setting any target value, `relative` sets relative value, which will be added to the property value when the tween starts.

```javascript
follow(accessor, toGetter)
follow(accessor, fromValue, toGetter)
```
Similar as the `target` functions, the `follow` functions add a property to tween on. The target value will be retrieved from toGetter dynamically. We can use Getter.create to create the target getter.


## Timeline special methods

```javascript
tween()
```
Create a tween. The timeline will own the new created tween. The tween is not on the timeline until functions append, prepend, insert, or setAt are called.

```javascript
timeline()
```
Create a timeline. The timeline will own the new created timeline. The new created timeline is not on the timeline until functions append, prepend, insert, or setAt are called.

```javascript
append(tweenable)
```
Append the tweenable to the timeline. If there is already 8 time units in the timeline, tweenable will start from 8th time units.  
The function returns the start time of the tweenable.  
Note the tweenable must be owned by the timeline, or to say, must be created by tween() or timeline() of the timeline.

```javascript
prepend(tweenable)
```
Insert the tweenable to the beginning of the timeline. The tweenable will always start from 0th time unit. All other tweenables on the timeline will be pushed back.  
Note the tweenable must be owned by the timeline, or to say, must be created by tween() or timeline() of the timeline.

```javascript
insert(time, tweenable)
```
Insert the tweenable at the "time" of the timeline. The tweenable will always start from "time" time unit. All other tweenables which start time is later than or equal to "time" on the timeline will be pushed back.  
Note the tweenable must be owned by the timeline, or to say, must be created by tween() or timeline() of the timeline.

```javascript
setAt(time, tweenable)
```
Put the tweenable at the "time" of the timeline. The tweenable will always start from "time" time unit. All other tweenables are not affected.  
Note the tweenable must be owned by the timeline, or to say, must be created by tween() or timeline() of the timeline.

```javascript
getStartTime(tweenable)
```
Get the start time of a tweenable.

```javascript
getTweenableCount()
```
Get tweenable count.

```javascript
clear()
```
Clear all tweenables.

```javascript
remove(tweenable)
```
Remove tweenable from the tween list.


## Use TweenList

Though we can create objects of GTween and GTimeline and tick them, a better way is to use TweenList. Tween drives all underlying tweenables.

To use TweenList, we can create new instance of TweenList, also we can use the global TweenList instance by calling TweenList.getInstance().

```javascript
static getInstance()
```
Get the global singleton instance of TweenList.

```javascript
tween()
```
Create a tween and return the reference.

```javascript
timeline()
```
Create a timeline and return the reference.

```javascript
tick(frameDuration)
```
Step forward the time.

```javascript
getTweenableCount()
```
Get tweenable count.

```javascript
clear()
```
Clear all tweenables.

```javascript
remove(tweenable)
```
Remove tweenable from the tween list.


## Drive the tween

To be most platform independent, the tween library doesn't update each tweens or timelines. It's up to the user to call the function "tick" on Tween, Timeline, or TweenList.
```javascript
tick(frameDuration)
```

**Canveat**: if the frameDuration is 0, the timeline will start any pending tweens immediately and cause weird behavior. So only use positive number as frameDuration. If your game frame rate is over 1000 that cause the frame duration is under 1 millisecond, you should use microsecond or even nanosecond which is never goes to zero.

