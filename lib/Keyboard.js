import { Application } from './Application.js';
import { Events } from './Event.js';

class Keyboard
{
	static getInstance()
	{
		return Keyboard._instance;
	}
	
	constructor()
	{
		this._keyList = new Array(256);

		window.addEventListener('keyup', this._onKeyUp.bind(this), false);
		window.addEventListener('keydown', this._onKeyDown.bind(this), false);
	}
	
	_onKeyUp(e)
	{
		this._keyList[e.keyCode] = 0;
		Application.getInstance().getEventQueue().post(Events.keyUp, e.keyCode);
	}

	_onKeyDown(e)
	{
		if(this._keyList[e.keyCode]) {
			return;
		}
		this._keyList[e.keyCode] = Application.getInstance().getFrameCount();
		Application.getInstance().getEventQueue().post(Events.keyDown, e.keyCode);

		//console.log('Key down: name=' + this.getKeyCodeName(e.keyCode) + ' keyCode=' + e.keyCode);
	}
	
	isKeyJustPressed(keyCode)
	{
		return this._keyList[keyCode] === Application.getInstance().getFrameCount();
	}

	isKeyPressed(keyCode)
	{
		return this._keyList[keyCode];
	}

	isKeyUp(keyCode)
	{
		return !this._keyList[keyCode];
	}

	getKeyCodeName(keyCode)
	{
		for(let key in Keyboard.keyCodes) {
			if(Keyboard.keyCodes[key] === keyCode) {
				return key;
			}
		}
		
		return '';
	}

}

Keyboard._instance = new Keyboard();

Keyboard.keyCodes = {
	backspace: 8,
	tab: 9,
	enter: 13,
	shift: 16,
	ctrl: 17,
	alt: 18,
	pause: 19,
	capsLock: 20,
	escape: 27,
	space: 32,
	pageUp: 33,
	pageDown: 34,
	end: 35,
	home: 36,
	leftArrow: 37,
	upArrow: 38,
	rightArrow: 39,
	downArrow: 40,
	insert: 45,
	delete: 46,
	n0: 48,
	n1: 49,
	n2: 50,
	n3: 51,
	n4: 52,
	n5: 53,
	n6: 54,
	n7: 55,
	n8: 56,
	n9: 57,
	a: 65,
	b: 66,
	c: 67,
	d: 68,
	e: 69,
	f: 70,
	g: 71,
	h: 72,
	i: 73,
	j: 74,
	k: 75,
	l: 76,
	m: 77,
	n: 78,
	o: 79,
	p: 80,
	q: 81,
	r: 82,
	s: 83,
	t: 84,
	u: 85,
	v: 86,
	w: 87,
	x: 88,
	y: 89,
	z: 90,
	leftWindow: 91,
	rightWindow: 92,
	selectKey: 93,
	numpad0: 96,
	numpad1: 97,
	numpad2: 98,
	numpad3: 99,
	numpad4: 100,
	numpad5: 101,
	numpad6: 102,
	numpad7: 103,
	numpad8: 104,
	numpad9: 105,
	multiply: 106,
	add: 107,
	subtract: 109,
	decimalPoint: 110,
	divide: 111,
	f1: 112,
	f2: 113,
	f3: 114,
	f4: 115,
	f5: 116,
	f6: 117,
	f7: 118,
	f8: 119,
	f9: 120,
	f10: 121,
	f11: 122,
	f12: 123,
	numLock: 144,
	scrollLock: 145,
	semiColon: 186,
	equal: 187,
	comma: 188,
	dash: 189,
	period: 190,
	forwardSlash: 191,
	graveAccent: 192,
	leftBracket: 219,
	backSlash: 220,
	rightBraket: 221,
	singleQuote: 222
};

export { Keyboard };

