import { Point } from './Geometry.js';

export let RenderAnchor = {
	none: 0,

	hLeft: 0x01,
	hCenter: 0x02,
	hRight: 0x04,
	hMask: 0x0f,

	vTop: 0x10,
	vCenter: 0x20,
	vBottom: 0x40,
	vMask: 0xf0,
};

RenderAnchor.leftTop = RenderAnchor.hLeft | RenderAnchor.vTop;
RenderAnchor.center = RenderAnchor.hCenter | RenderAnchor.vCenter;
RenderAnchor.rightTop = RenderAnchor.hRight | RenderAnchor.vTop;

export function getOriginByRenderAnchor(renderAnchor, size)
{
	let result = new Point(0, 0);
	
	if(! size) {
		return result;
	}

	switch(renderAnchor & RenderAnchor.hMask) {
	case RenderAnchor.hLeft:
		break;

	case RenderAnchor.hCenter:
		result.x = size.width / 2;
		break;

	case RenderAnchor.hRight:
		result.x = size.width;
		break;

	default:
		break;
	}

	switch(renderAnchor & RenderAnchor.vMask) {
	case RenderAnchor.vTop:
		break;

	case RenderAnchor.vCenter:
		result.y = size.height / 2;
		break;

	case RenderAnchor.vBottom:
		result.y = size.height;
		break;

	default:
		break;
	}

	return result;
}
