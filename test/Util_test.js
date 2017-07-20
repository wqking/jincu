import * as assert from 'assert';

import { Util } from '../lib/util/Util.js';

describe('Util', () => {
	context('mergeSort', () => {
		it('Without comparer', () => {
			let array = [ 3, 0, 6, 2, 4, 1, 5 ];
			Util.mergeSort(array);
			for(let i = 0; i < array.length; ++i) {
				assert.strictEqual(array[i], i);
			}
		});

		it('Stable', () => {
			let array = [
				{ value: 5, index: 5 },
				{ value: 2, index: 2 },
				{ value: 3, index: 3 },
				{ value: 1, index: 1 },
				{ value: 0, index: 0 },
				{ value: 3, index: 4 },
				{ value: 5, index: 6 },
			];
			Util.mergeSort(array, (a, b)=>{ return a.value - b.value; });
			for(let i = 0; i < array.length - 1; ++i) {
				let a = array[i];
				let b = array[i + 1];
				assert.ok(a.value <= b.value);
				assert.ok(a.index < b.index);
			}
		});
	});


});
