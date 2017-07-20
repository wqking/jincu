export const Events = {
	render: 'render',
	update: 'update',
	touchMoved: 'touchMoved',
	touchPressed: 'touchPressed',
	touchReleased: 'touchReleased',
	keyDown: 'keyDown',
	keyUp: 'keyUp',
};

class TouchEvent
{
	constructor()
	{
		this.propagation = false;
		this.screenPosition = null;
		this.worldPosition = null;
		this.touchedEntity = null;
		this.finger = 0;
		this.down = false;
	}

}

export { TouchEvent };
