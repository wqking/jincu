import { Component } from './Component.js';
import { EntityUtil } from './EntityUtil.js';
import { RenderAnchor, getOriginByRenderAnchor } from '../RenderAnchor.js';
import { Flags } from '../Flags.js';
import { Point } from '../Geometry.js';
import { getDecompositedScale } from '../Matrix.js';

let _cachedVector = new Point();

class ComponentAnchor extends Component
{
	constructor(anchor)
	{
		super(Component.types.anchor);
		
		this._anchor = anchor || RenderAnchor.none;
		this._flags = new Flags();
	}

	getAnchor()
	{
		return this._anchor;
	}
	
	setAnchor(renderAnchor)
	{
		this._anchor = renderAnchor;
		return this;
	}

	isFlipX()
	{
		return this._flags.has(ComponentAnchor.flags.flagFlipX);
	}

	setFlipX(flipX)
	{
		if(flipX != this.isFlipX()) {
			const parentGlobalFlipX = this.isFlipX() ^ this._isGlobalFlipX();
			const parentGlobalFlipY = this.isFlipY() ^ this._isGlobalFlipY();
			
			this._flags.setByBool(ComponentAnchor.flags.flagFlipX, flipX);
			
			this._doApplyGlobalFlipXy(parentGlobalFlipX, parentGlobalFlipY);
		}
		return this;
	}
	
	isFlipY()
	{
		return this._flags.has(ComponentAnchor.flags.flagFlipY);
	}
	
	setFlipY(flipY)
	{
		if(flipY != this.isFlipY()) {
			const parentGlobalFlipX = this.isFlipX() ^ this._isGlobalFlipX();
			const parentGlobalFlipY = this.isFlipY() ^ this._isGlobalFlipY();
			
			this._flags.setByBool(ComponentAnchor.flags.flagFlipY, flipY);
			
			this._doApplyGlobalFlipXy(parentGlobalFlipX, parentGlobalFlipY);
		}
		return this;
	}

	apply(matrix, size)
	{
		const globalFlipX = this._isGlobalFlipX();
		const globalFlipY = this._isGlobalFlipY();
		
		if(globalFlipX || globalFlipY) {
			const scale = getDecompositedScale(matrix);
			if(scale.x !== 0.0 && scale.y !== 0.0) {
				_cachedVector.x = 1.0 / scale.x;
				_cachedVector.y = 1.0 / scale.y;
				matrix = matrix.scale(_cachedVector);
			}
			if(globalFlipX && ! globalFlipY) {
				_cachedVector.x = -scale.x;
				_cachedVector.y = scale.y;
				matrix = matrix.scale(_cachedVector);
				if((this._anchor & RenderAnchor.hLeft) !== RenderAnchor.none) {
					_cachedVector.x = -size.width;
					_cachedVector.y = 0;
					matrix = matrix.translate(_cachedVector);
				}
			}
			else if(! globalFlipX && globalFlipY) {
				_cachedVector.x = scale.x;
				_cachedVector.y = -scale.y;
				matrix = matrix.scale(_cachedVector);
				if((this._anchor & RenderAnchor.vTop) !== RenderAnchor.none) {
					_cachedVector.x = 0;
					_cachedVector.y = -size.height;
					matrix = matrix.translate(_cachedVector);
				}
			}
			else if(globalFlipX && globalFlipY) {
				_cachedVector.x = -scale.x;
				_cachedVector.y = -scale.y;
				matrix = matrix.scale(_cachedVector);
				_cachedVector.x = 0;
				_cachedVector.y = 0;
				if((this._anchor & RenderAnchor.hLeft) !== RenderAnchor.none) {
					_cachedVector.x = -size.width;
				}
				if((this._anchor & RenderAnchor.vTop) !== RenderAnchor.none) {
					_cachedVector.y = -size.height;
				}
				matrix = matrix.translate(_cachedVector);
			}
		}

		if(this._anchor !== RenderAnchor.leftTop) {
			let point = getOriginByRenderAnchor(this._anchor, size);
			point.x = -point.x;
			point.y = -point.y;
			matrix = matrix.translate(point);
		}

		return matrix;
	}

	_doApplyGlobalFlipXy(parentGlobalFlipX, parentGlobalFlipY)
	{
		this._flags.setByBool(ComponentAnchor.flags.flagGlobalFlipX, parentGlobalFlipX ^ this.isFlipX());
		this._flags.setByBool(ComponentAnchor.flags.flagGlobalFlipY, parentGlobalFlipY ^ this.isFlipY());
		
		if(! this.getEntity()) {
			return;
		}
		
		EntityUtil.enumerateEntityChildren(this.getEntity().getComponent(Component.types.localTransform),
			(localTransform) => {
				const anchor = localTransform.getEntity().getComponent(Component.types.anchor);
				if(anchor) {
					anchor._doApplyGlobalFlipXy(this._isGlobalFlipX(), this._isGlobalFlipY());
				}
			}
		);
	}

	_isGlobalFlipX()
	{
		return this._flags.has(ComponentAnchor.flags.flagGlobalFlipX);
	}
	
	_isGlobalFlipY()
	{
		return this._flags.has(ComponentAnchor.flags.flagGlobalFlipY);
	}

	// override
	doAfterSetEntity()
	{
		const localTransform = this.getEntity().getComponent(Component.types.localTransform);
		if(localTransform && localTransform.getParent()) {
			const parentAnchor = localTransform.getParent().getEntity().getComponent(Component.types.anchor);
			if(parentAnchor) {
				this._flags.setByBool(ComponentAnchor.flags.flagGlobalFlipX, parentAnchor._isGlobalFlipX() ^ this.isFlipX());
				this._flags.setByBool(ComponentAnchor.flags.flagGlobalFlipY, parentAnchor._isGlobalFlipY() ^ this.isFlipY());
			}
		}
	}

}

ComponentAnchor.flags = {
	flagFlipX: (1 << 0),
	flagFlipY: (1 << 1),
	flagGlobalFlipX: (1 << 2),
	flagGlobalFlipY: (1 << 3)
};

export { ComponentAnchor };
