import * as assert from 'assert';
import { CircularQueue } from '../lib/CircularQueue.js';

describe('CircularQueue', () => {
	context('empty', () => {
		it('New queue should be empty', () => {
			let queue = new CircularQueue();
			assert.ok(queue.isEmpty());
			assert.strictEqual(queue.getCount(), 0);
		});
	});

	context('enqueue without grow', () => {
		it('enqueue', () => {
			let queue = new CircularQueue();
			assert.ok(queue.isEmpty());
			assert.strictEqual(queue.getCount(), 0);
			queue.enqueue(38);
			assert.ok(! queue.isEmpty());
			assert.strictEqual(queue.getCount(), 1);
			
			assert.strictEqual(queue.peek(0), 38);
			assert.strictEqual(queue.getCount(), 1);
			assert.strictEqual(queue.dequeue(), 38);
			assert.strictEqual(queue.getCount(), 0);
		});

		it('enqueue mixed with dequeue', () => {
			let queue = new CircularQueue();
			assert.ok(queue.isEmpty());
			assert.strictEqual(queue.getCount(), 0);
			queue.enqueue(1);
			queue.enqueue(2);
			assert.strictEqual(queue.getCount(), 2);
			assert.strictEqual(queue.dequeue(), 1);
			assert.strictEqual(queue.getCount(), 1);
			queue.enqueue(3);
			queue.enqueue(4);
			assert.strictEqual(queue.getCount(), 3);
			assert.strictEqual(queue.dequeue(), 2);
			assert.strictEqual(queue.getCount(), 2);
		});
	});

	context('enqueue with grow', () => {
		it('enqueue', () => {
			let queue = new CircularQueue(3, 2);
			assert.ok(queue.isEmpty());
			assert.strictEqual(queue.getCount(), 0);
			queue.enqueue(1);
			queue.enqueue(2);
			queue.enqueue(3);
			assert.ok(queue.isFull());
			assert.strictEqual(queue.getCount(), 3);
			queue.enqueue(4);
			queue.enqueue(5);
			assert.ok(queue.isFull());
			assert.strictEqual(queue.getCount(), 5);
			
			assert.strictEqual(queue.peek(0), 1);
			assert.strictEqual(queue.peek(1), 2);
			assert.strictEqual(queue.peek(2), 3);
			assert.strictEqual(queue.peek(3), 4);
			assert.strictEqual(queue.peek(4), 5);
			assert.strictEqual(queue.getCount(), 5);

			assert.strictEqual(queue.dequeue(), 1);
			assert.strictEqual(queue.dequeue(), 2);
			assert.strictEqual(queue.dequeue(), 3);
			assert.strictEqual(queue.dequeue(), 4);
			assert.strictEqual(queue.dequeue(), 5);
			assert.strictEqual(queue.getCount(), 0);
		});
	});

});
