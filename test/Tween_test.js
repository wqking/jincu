import * as assert from 'assert';

import { TestUtil } from './TestUtil';
import { Tween } from '../lib/tween/tween.js';
import { LinearEase } from '../lib/tween/TweenEases.js';

describe('Tween', () => {
	context('target', () => {
		it('default from', () => {
			let data = { x: 0 };
			let finished = false;
			
			let tween = (new Tween())
				.duration(100)
				.ease(LinearEase.ease())
				.target(data, 100)
				.onComplete(()=>{ finished = true; })
			;
			
			tween.tick(1);
			assert.ok(TestUtil.almostEqual(data.x, 1));
			assert.ok(! finished);
			assert.ok(! tween.isCompleted());

			tween.tick(5);
			assert.ok(TestUtil.almostEqual(data.x, 6));
			assert.ok(! finished);
			assert.ok(! tween.isCompleted());

			tween.tick(9);
			assert.ok(TestUtil.almostEqual(data.x, 15));
			assert.ok(! finished);
			assert.ok(! tween.isCompleted());

			tween.tick(1000);
			assert.ok(TestUtil.almostEqual(data.x, 100));
			assert.ok(finished);
			assert.ok(tween.isCompleted());
		});

	});

});
