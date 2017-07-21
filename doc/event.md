# Event system

Jincu is event driven. Instead of the traditional top down render or update flow, Jincu sends event when needing to do so. This decouples the system significantly.

## Class EventDispatcher

`EventDispatcher` is the core class in the event system. For any class inherits from EventDispatcher, the class then becomes an event dispatcher and can be listened for events.

### Member methods

```javascript
addListener(e, listener)
```
Add a listener.  
`e`: a string of the event type.  
`listener`: the callback function. Its first argument is always `e`, and the other arguments are determined by the event dispatcher.

```javascript
addListenerOnce(e, listener)
```
Add a one shot event. After the event is sent once, the listener is removed from the dispatcher automatically.

```javascript
removeListener(e, listener)
```
Remove the listener.

```javascript
removeAllListeners(e)
```
Remove all listeners that are listening for event `e`.

```javascript
hasListener(e, listener)
```
Returns whether the dispatcher contains the listener.

```javascript
dispatchEvent(e, other...arguments)
```
Dispatch an event. Any arguments can be attached. During the invoking on dispatchEvent, all listener on `e` will be called synchronously.


## Class EventQueue

Class `Application` maintains an application wide event queue. Events can be posted to the queue either synchronously or asynchronously.  
To get the queue, call `Application.getInstance().getEventQueue()`.

### Member methods

EventQueue inherits from EventDispatcher, so it contains all methods from EventDispatcher. Below is the methods in EventQueue.

```javascript
send(e, other...arguments)
```
Similar as dispatchEvent, send the event immediately and bypass the event queue.

```javascript
post(e, other...arguments)
```
Put the event in the event queue. The event will be dispatched on next frame.

```javascript
process()
```
Dispatch all events in the queue. This method is called in the application main loop. You should not call it manually.

