import { Util } from './util/Util.js';

class FrameAnimationData
{
	constructor(frameIndexList, durationMilliseconds)
	{
		this._frameIndexList = frameIndexList;
		this._durationMilliseconds = durationMilliseconds;
	}

	getFrameIndexList()
	{
		return this._frameIndexList;
	}
	
	getDurationMilliseconds()
	{
		return this._durationMilliseconds;
	}

}

export { FrameAnimationData };


class FrameAnimationSetData
{
	constructor()
	{
		this._animationDataList = [];
		this._nameMap = {};
	}
	
	append(name, animationData)
	{
		const item = {
			name: name,
			data: animationData
		};
		
		this._animationDataList.push(item);
		this._nameMap[name] = item;
	}
	
	getAnimationData(name)
	{
		const item = this._nameMap[name];
		if(item) {
			return item.data;
		}
		return null;
	}
	
	getAnimationCount()
	{
		return this._animationDataList.length;
	}
	
	getAnimationNameAt(index)
	{
		return this._animationDataList[index].name;
	}
	
	getAnimationDataAt(index)
	{
		return this._animationDataList[index].data;
	}

}

export { FrameAnimationSetData };


function extractAnimationNameAndIndex(resourceName, result)
{
	result.order = -1;
	const size = resourceName.length;
	if(size === 0) {
		result.name = "";
		return;
	}

	let digitEnd = size - 1;
	let digitStart = digitEnd;
	while(digitStart > 0 && Util.codeIsDigit(resourceName.charCodeAt(digitStart))) {
		--digitStart;
	}
	++digitStart;

	result.order = 0;
	for(let i = digitStart; i <= digitEnd; ++i) {
		result.order = result.order * 10 + (resourceName.charCodeAt(i) - 0x30);
	}

	let nameEnd = digitStart;
	for(;;) {
		--nameEnd;

		if(nameEnd <= 0) break;

		if(Util.codeIsDigit(resourceName.charCodeAt(nameEnd))) continue;
		const c = resourceName.charAt(nameEnd);
		if(c === '-' || c === '_') continue;

		break;
	}

	result.name = resourceName.substr(0, nameEnd);
}

export function buildFrameAnimationDataFromAtlas(data, atlas, millsecondsBetweenFrame)
{
	millsecondsBetweenFrame = millsecondsBetweenFrame || 30;

	const animationMap = {};

	const itemList = atlas.getItemList();

	const nameAndOrder = {};
	for(let item of itemList) {
		extractAnimationNameAndIndex(item.name, nameAndOrder);

		if(nameAndOrder.order < 0 || nameAndOrder.name.length === 0) {
			continue;
		}

		if(! animationMap[nameAndOrder.name]) {
			animationMap[nameAndOrder.name] = [];
		}
		animationMap[nameAndOrder.name].push({
			frameOrder: nameAndOrder.order,
			frameIndex: atlas.getIndex(nameAndOrder.name)
		});
	}

	const compare = (a, b) => { return a.frameOrder - b.frameOrder; };

	for(let name in animationMap) {
		const itemList = animationMap[name];
		itemList.sort(compare);
		const indexList = new Array(itemList.length);
		for(let i = 0; i < indexList.length; ++i) {
			indexList[i] = itemList[i].frameIndex;
		}
		const duration = indexList.length * millsecondsBetweenFrame;
		data.append(name, new FrameAnimationData(indexList, duration));
	}
}

