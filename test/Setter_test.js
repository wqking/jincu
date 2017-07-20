import * as assert from 'assert';

import { Setter } from '../lib/accessor/Setter.js';

describe('Setter', () => {
	context('by function', () => {
		it('1', () => {
			let setter = null;
			let value = 0;
			
			setter = new Setter((v)=>{ value = v; });
			setter.set(38);
			assert.strictEqual(value, 38);
			
			setter = new Setter(function(v) { value = v; });
			setter.set('def');
			assert.strictEqual(value, 'def');
		});

	});

	context('by object', () => {
		it('1', () => {
			let setter = null;
			
			let obj = { y: 0 };
			setter = new Setter(obj);
			setter.set('hijk');
			assert.strictEqual(obj.y, 'hijk');
			setter.set(56);
			assert.strictEqual(obj.y, 56);
		});

	});

});
