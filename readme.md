# Jincu -- a 2D game framework for web game written in JavaScript ES6

## Introduction

Jincu is a 2D game framework. The first version is mostly converted from [my Gincu C++ 2D game framework](https://github.com/wqking/gincu).
The library is written in JavaScript ES6.

## Live demo
https://wqking.github.io/jincudemo/index.html

## Version

0.0.1

## Supported platform

 * Web browser.
 
## License

Apache License, Version 2.0

## Core system and features

 * Entity Component System (ECS).
 * Scene management.
 * Scene transition effect.
 * ECS based scene graph (ComponentLocalTransform).
 * Camera system.
 * Anchor and flip x/y (ComponentAnchor).
 * Sprite sheet.
 * Frame based animation.
 * Tween animation. The tween module is converted from [my cpgf library](https://github.com/cpgf/cpgf).
 * Event driven.
 * Underlying render engine agnostic. Now the library using HTML5 canvas as the render engine, in the future WebGL will be added.

## Documentations

[Install, compile, and run](doc/install.md)

[Start your first game](doc/start.md)

[All documents](doc/readme.md)
