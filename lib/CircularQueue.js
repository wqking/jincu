class CircularQueue
{
	constructor(initialSize, incrementSize)
	{
		this._queue = new Array(initialSize || 50);
		this._incrementSize = incrementSize || 20;
		
		this._length = this._queue.length;
		this._index = 0;
		this._count = 0;
	}

	enqueue(data)
	{
		if(this.isFull()) {
			this._doGrow();
		}
		
		let index = (this._index + this._count) % this._length;
		this._queue[index] = data;
		++this._count;
	}
	
	dequeue()
	{
		if(this.isEmpty()) {
			return null;
		}
		
		let result = this._queue[this._index];
		this._queue[this._index] = null;
		this._index = (this._index + 1) % this._length;
		--this._count;
		return result;
	}
	
	peek(index)
	{
		return this._queue[(index + this._index) % this._length];
	}

	isFull()
	{
		return this._count === this._length;
	}

	isEmpty()
	{
		return this._count === 0;
	}

	getCount()
	{
		return this._count;
	}

	_doGrow()
	{
		let newLength = this._length + this._incrementSize;
		let countToMove = this._length - this._index;
		
		for(let i = countToMove - 1; i >= 0; --i) {
			let oldIndex = this._length - (countToMove - i);
			this._queue[newLength - (countToMove - i)] = this._queue[oldIndex];
			this._queue[oldIndex] = null;
		}
		
		this._length = newLength;
		this._index += this._incrementSize;
	}
}

export { CircularQueue };
