import * as assert from 'assert';
import { EventDispatcher } from '../lib/EventDispatcher.js';

describe('EventDispatcher', () => {
	context('add', () => {
		it('Listener should exist after added', () => {
			let eventDispatch = new EventDispatcher();
			let cb = function() {};
			eventDispatch.addListener('abc', cb);
			assert.ok(eventDispatch.hasListener('abc', cb));
		});

		it('Listener should exist after added twice', () => {
			let eventDispatch = new EventDispatcher();
			let cb = function() {};
			eventDispatch.addListener('abc', cb);
			eventDispatch.addListener('abc', cb);
			assert.ok(eventDispatch.hasListener('abc', cb));
		});
	});

	context('remove', () => {
		it('Listener should not exist after removed', () => {
			let eventDispatch = new EventDispatcher();
			let cb = function() {};
			eventDispatch.addListener('abc', cb);
			eventDispatch.removeListener('abc', cb);
			assert.ok(! eventDispatch.hasListener('abc', cb));
		});

		it('Listener should not exist after removed twice', () => {
			let eventDispatch = new EventDispatcher();
			let cb = function() {};
			eventDispatch.addListener('abc', cb);
			eventDispatch.removeListener('abc', cb);
			eventDispatch.removeListener('abc', cb);
			assert.ok(! eventDispatch.hasListener('abc', cb));
		});
	});

	context('dispatch', () => {
		it('Listener should be called after dispatch', () => {
			let eventDispatch = new EventDispatcher();
			let value = 0;
			let cb = function() { value = 1; };
			eventDispatch.addListener('abc', cb);
			eventDispatch.dispatchEvent('abc');
			assert.strictEqual(value, 1);
		});

		it('Listener should be called with proper arguments after dispatch', () => {
			let eventDispatch = new EventDispatcher();
			let value = 0;
			let cb = function(e, a, b, c) { value = a + b + c; };
			eventDispatch.addListener('abc', cb);
			eventDispatch.dispatchEvent('abc', 1, 2, 5);
			assert.strictEqual(value, 8);
		});
	});
});
