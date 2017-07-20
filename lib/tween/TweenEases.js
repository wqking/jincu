class LinearEase
{
	static ease()
	{
		return LinearEase._doEase;
	}

	static easeIn()
	{
		return LinearEase._doEase;
	}

	static easeOut()
	{
		return LinearEase._doEase;
	}

	static easeInOut()
	{
		return LinearEase._doEase;
	}

	static _doEase(param)
	{
		return param.current / param.total;
	}
}

export { LinearEase };


class BackEase
{
	static easeIn(s) {
		s = s || 1.70158;
		return (param)=>BackEase._easeIn(param, s);
	}
	
	static easeOut(s) {
		s = s || 1.70158;
		return (param)=>BackEase._easeOut(param, s);
	}
	
	static easeInOut(s) {
		s = s || 1.70158;
		return (param)=>BackEase._easeInOut(param, s);
	}

	static _easeIn(param, s)
	{
		const t = param.current / param.total;
		return t * t * ((s + 1) * t - s);
	}

	static _easeOut(param, s)
	{
		let t = param.current / param.total;
		t = t - 1;
		return (t * t * ((s + 1) * t + s) + 1);
	}

	static _easeInOut(param, s)
	{
		let t = param.current / (param.total * 0.5);
		const ns = s * 1.525;
		if(t < 1) {
			return 0.5 * ( t * t * ((ns +1 ) * t - ns));
		}
		else {
			t -= 2;
			return 0.5 * (t * t * ((ns + 1) * t + ns) + 2);
		}
	}

}

export { BackEase };


class BounceEase
{
	static easeIn() {
		return BounceEase._easeIn;
	}
	
	static easeOut() {
		return BounceEase._easeOut;
	}
	
	static easeInOut() {
		return BounceEase._easeInOut;
	}

	static _easeIn(param)
	{
		BounceEase._tempParam.current = param.total - param.current;
		BounceEase._tempParam.total = param.total;
		return 1 - BounceEase._easeOut(BounceEase._tempParam);
	}

	static _easeOut(param)
	{
		let t = param.current / param.total;
		if(t < 1.0 / 2.75) {
			return 7.5625 * t * t;
		}
		else if(t < 2.0 /2.75) {
			t -= 1.5 /2.75;
			return 7.5625 * t * t + 0.75;
		}
		else if(t < 2.5 / 2.75) {
			t -= 2.25 / 2.75;
			return 7.5625 * t * t + 0.9375;
		} else {
			t -= 2.625 / 2.75;
			return 7.5625 * t * t + 0.984375;
		}
	}

	static _easeInOut(param)
	{
		if(param.current < param.total * 0.5) {
			BounceEase._tempParam.current = param.current * 2;
			BounceEase._tempParam.total = param.total;
			return BounceEase._easeIn(BounceEase._tempParam) * 0.5;
		}
		else {
			BounceEase._tempParam.current = param.current * 2 - param.total;
			BounceEase._tempParam.total = param.total;
			return BounceEase._easeOut(BounceEase._tempParam) * 0.5 + 0.5;
		}
	}

}

BounceEase._tempParam = {
	current: 0,
	total: 0
};

export { BounceEase };


class CircleEase
{
	static easeIn() {
		return CircleEase._easeIn;
	}
	
	static easeOut() {
		return CircleEase._easeOut;
	}
	
	static easeInOut() {
		return CircleEase._easeInOut;
	}

	static _easeIn(param)
	{
		const t = param.current / param.total;
		return -Math.sqrt(1.0 - t * t) + 1.0;
	}

	static _easeOut(param)
	{
		const t = param.current / param.total - 1.0;
		return Math.sqrt(1.0 - t * t);
	}

	static _easeInOut(param)
	{
		let t = param.current / (param.total * 0.5);
		if(t < 1.0) {
			return -0.5 * (Math.sqrt(1.0 - t * t) - 1.0);
		}
		else {
			t -= 2.0;
			return 0.5 * (Math.sqrt(1.0 - t * t) + 1);
		}
	}

}

export { CircleEase };


class CubicEase
{
	static easeIn() {
		return CubicEase._easeIn;
	}
	
	static easeOut() {
		return CubicEase._easeOut;
	}
	
	static easeInOut() {
		return CubicEase._easeInOut;
	}

	static _easeIn(param)
	{
		const t = param.current / param.total;
		return t * t * t;
	}

	static _easeOut(param)
	{
		const t = param.current / param.total - 1.0;
		return t * t * t + 1.0;
	}

	static _easeInOut(param)
	{
		let t = param.current / (param.total * 0.5);
		if(t < 1.0) {
			return 0.5 * t * t * t;
		}
		else {
			t -= 2.0;
			return 0.5 * (t * t * t + 2.0);
		}
	}

}

export { CubicEase };


class ElasticEase
{
	static easeIn(amplitude, period) {
		amplitude = amplitude || 0.0;
		period = period || 0;
		return (param)=>ElasticEase._easeIn(param, amplitude, period);
	}
	
	static easeOut(amplitude, period) {
		amplitude = amplitude || 0.0;
		period = period || 0;
		return (param)=>ElasticEase._easeOut(param, amplitude, period);
	}
	
	static easeInOut(amplitude, period) {
		amplitude = amplitude || 0.0;
		period = period || 0;
		return (param)=>ElasticEase._easeInOut(param, amplitude, period);
	}
	
	static _easeIn(param, amplitude, period)
	{
		if(param.current === 0.0) {
			return 0.0;
		}
		if(param.current >= param.total) {
			return 1.0;
		}
		let s = 0;
		let t = param.current / param.total;
		let np = period;
		let na = amplitude;
		if(np === 0.0) {
			np = param.total * 0.3;
		}
		if(na === 0.0 || na < 1.0) {
			na = 1.0;
			s = np / 4.0;
		}
		else {
			s = np / (Math.PI * 2) * Math.asin(1.0 / na);
		}
		t -= 1.0;
		return -na * Math.pow(2, 10 * t) * Math.sin((t * param.total - s) * (Math.PI * 2) / np);
	}
	
	static _easeOut(param, amplitude, period)
	{
		if(param.current === 0.0) {
			return 0.0;
		}
		if(param.current >= param.total) {
			return 1.0;
		}
		let s = 0;
		let t = param.current / param.total;
		let np = period;
		let na = amplitude;
		if(np === 0.0) {
			np = param.total * 0.3;
		}
		if(na === 0.0 || na < 1.0) {
			na = 1.0;
			s = np / 4.0;
		}
		else {
			s = np / (Math.PI * 2) * Math.asin(1.0 / na);
		}
		return na * Math.pow(2, -10 * t) * Math.sin((t * param.total - s) * (Math.PI * 2) / np) + 1.0;
	}
	
	static _easeInOut(param, amplitude, period)
	{
		if(param.current === 0.0) {
			return 0.0;
		}
		if(param.current >= param.total) {
			return 1.0;
		}
		let s = 0;
		let t = param.current / (param.total * 0.5);
		let np = period;
		let na = amplitude;
		if(np === 0.0) {
			np = param.total * (0.3 * 1.5);
		}
		if(na === 0.0 || na < 1.0) {
			na = 1.0;
			s = np / 4.0;
		}
		else {
			s = np / (Math.PI * 2) * Math.asin(1.0 / na);
		}
		if(t < 1) {
			t -= 1.0;
			return -0.5 * na * Math.pow(2, 10 * t) * Math.sin((t * param.total - s) * (Math.PI * 2) / np);
		}
		else {
			t -= 1.0;
			return na * Math.pow(2, -10 * t) * Math.sin((t * param.total - s) * (Math.PI * 2) / np) * 0.5 + 1.0;
		}
	}
	
}

export { ElasticEase };


class ExponentEase
{
	static easeIn() {
		return ExponentEase._easeIn;
	}
	
	static easeOut() {
		return ExponentEase._easeOut;
	}
	
	static easeInOut() {
		return ExponentEase._easeInOut;
	}

	static _easeIn(param)
	{
		if(param.current === 0.0) {
			return 0.0;
		}
		else {
			return Math.pow(2, 10 * (param.current / param.total - 1))  - 0.001;
		}
	}

	static _easeOut(param)
	{
		if(param.current >= param.total) {
			return 1.0;
		}
		else {
			return -Math.pow(2, -10.0 * param.current / param.total) + 1.0;
		}
	}

	static _easeInOut(param)
	{
		if(param.current === 0.0) {
			return 0.0;
		}
		if(param.current >= param.total) {
			return 1.0;
		}
		const t = param.current / (param.total * 0.5);
		if(t < 1.0) {
			return 0.5 * Math.pow(2, 10.0 * (t - 1.0));
		}
		else {
			return 0.5 * (-Math.pow(2, -10.0 * (t - 1.0)) + 2.0);
		}
	}

}

export { ExponentEase };


class QuadEase
{
	static easeIn() {
		return QuadEase._easeIn;
	}
	
	static easeOut() {
		return QuadEase._easeOut;
	}
	
	static easeInOut() {
		return QuadEase._easeInOut;
	}

	static _easeIn(param)
	{
		const t = param.current / param.total;
		return t * t;
	}

	static _easeOut(param)
	{
		const t = param.current / param.total;
		return - t * (t - 2);
	}

	static _easeInOut(param)
	{
		let t = param.current / (param.total * 0.5);
		if(t < 1.0) {
			return 0.5 * t * t;
		}
		else {
			t = t - 1.0;
			return -0.5 * (t * (t - 2.0) - 1.0);
		}
	}

}

export { QuadEase };


class QuartEase
{
	static easeIn() {
		return QuartEase._easeIn;
	}
	
	static easeOut() {
		return QuartEase._easeOut;
	}
	
	static easeInOut() {
		return QuartEase._easeInOut;
	}

	static _easeIn(param)
	{
		const t = param.current / param.total;
		return t * t * t * t;
	}

	static _easeOut(param)
	{
		const t = param.current / param.total;
		return - t * t * t * t + 1;
	}

	static _easeInOut(param)
	{
		let t = param.current / (param.total * 0.5);
		if(t < 1.0) {
			return 0.5 * t * t * t * t;
		}
		else {
			t = t - 2.0;
			return -0.5 * (t * t * t * t - 2.0);
		}
	}

}

export { QuartEase };


class QuintEase
{
	static easeIn() {
		return QuintEase._easeIn;
	}
	
	static easeOut() {
		return QuintEase._easeOut;
	}
	
	static easeInOut() {
		return QuintEase._easeInOut;
	}

	static _easeIn(param)
	{
		const t = param.current / param.total;
		return t * t * t * t * t;
	}

	static _easeOut(param)
	{
		const t = param.current / param.total - 1;
		return t * t * t * t * t + 1;
	}

	static _easeInOut(param)
	{
		let t = param.current / (param.total * 0.5);
		if(t < 1.0) {
			return 0.5 * t * t * t * t * t;
		}
		else {
			t -= 2.0;
			return 0.5 * (t * t * t * t * t + 2.0);
		}
	}

}

export { QuintEase };


class SineEase
{
	static easeIn() {
		return SineEase._easeIn;
	}
	
	static easeOut() {
		return SineEase._easeOut;
	}
	
	static easeInOut() {
		return SineEase._easeInOut;
	}

	static _easeIn(param)
	{
		const t = param.current / param.total;
		return -Math.cos(t * Math.PI * 0.5) + 1.0;
	}

	static _easeOut(param)
	{
		const t = param.current / param.total;
		return Math.sin(t * Math.PI * 0.5);
	}

	static _easeInOut(param)
	{
		const t = param.current / param.total;
		return -0.5 * (Math.cos(Math.PI * t) - 1.0);
	}

}

export { SineEase };


const StrongEase = QuintEase;

export { StrongEase };
