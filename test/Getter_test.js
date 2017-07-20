import * as assert from 'assert';

import { Getter } from '../lib/accessor/Getter.js';

describe('Getter', () => {
	context('by constant', () => {
		it('null', () => {
			let getter = null;
			
			getter = new Getter(null);
			assert.strictEqual(getter.get(), null);
		});

		it('undefined', () => {
			let getter = null;
			
			getter = new Getter(undefined);
			assert.strictEqual(getter.get(), undefined);
		});

		it('boolean', () => {
			let getter = null;
			
			getter = new Getter(true);
			assert.strictEqual(getter.get(), true);
			
			getter = new Getter(false);
			assert.strictEqual(getter.get(), false);
		});

		it('number', () => {
			let getter = null;
			
			getter = new Getter(5);
			assert.strictEqual(getter.get(), 5);
			
			getter = new Getter(-8);
			assert.strictEqual(getter.get(), -8);
		});

		it('string', () => {
			let getter = null;
			
			getter = new Getter('');
			assert.strictEqual(getter.get(), '');
			
			getter = new Getter('abc');
			assert.strictEqual(getter.get(), 'abc');
		});

	});

	context('by function', () => {
		it('1', () => {
			let getter = null;
			
			getter = new Getter(()=>{ return 38; });
			assert.strictEqual(getter.get(), 38);
			
			getter = new Getter(function() { return 'def'; });
			assert.strictEqual(getter.get(), 'def');
		});

	});

	context('by object', () => {
		it('1', () => {
			let getter = null;
			
			getter = new Getter({ x: 98 });
			assert.strictEqual(getter.get(), 98);

			let obj = { y: 'hijk' };
			getter = new Getter(obj);
			assert.strictEqual(getter.get(), 'hijk');
			obj.y = 56;
			assert.strictEqual(getter.get(), 56);
		});

	});

});
