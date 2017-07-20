import { Flags } from './Flags.js';
import { Matrix } from './Matrix.js';
import { Point, Scale } from './Geometry.js';
import { Util } from './util/Util.js';

const Flag_Dirty = (1 << 0);
const Flag_Projection = (1 << 1);

class Transform
{
	constructor()
	{
		this._position = new Point();
		this._origin = new Point();
		this._scale = new Scale(1, 1);
		this._rotation = 0; //degree
		this._flags = new Flags;
		this._matrix = new Matrix();
	}

	assignFrom(other)
	{
		this._position.assignFrom(other._position);
		this._origin.assignFrom(other._origin);
		this._scale.assignFrom(other._scale);
		this._rotation = other._rotation;
		this._flags.assignFrom(other._flags);
		this._matrix.assignFrom(other._matrix);
		
		return this;
	}
	
	clone()
	{
		return (new Transform()).assignFrom(this);
	}

	getPosition()
	{
		return this._position;
	}
	
	setPosition(position)
	{
		this._position.assignFrom(position);
		this._flags.set(Flag_Dirty);
	}

	getOrigin()
	{
		return this._origin;
	}
	
	setOrigin(origin)
	{
		this._origin.assignFrom(origin);
		this._flags.set(Flag_Dirty);
	}

	getScale()
	{
		return this._scale;
	}
	
	setScale(scale)
	{
		this._scale.assignFrom(scale);
		this._flags.set(Flag_Dirty);
	}

	getRotation()
	{
		return this._rotation;
	}
	
	setRotation(rotation)
	{
		this._rotation = rotation;
		this._flags.set(Flag_Dirty);
	}
	
	setProjectionMode(/*projectionMode*/)
	{
/*
		if(projectionMode != this._isProjectionMode()) {
			this._flags.set(Flag_Dirty);
			this._flags.setByBool(Flag_Projection, projectionMode);
		}
*/
	}

	_isProjectionMode()
	{
		return this._flags.has(Flag_Projection);
	}
	
	getMatrix()
	{
		this._doUpdateTransform();
		return this._matrix;
	}

	_doUpdateTransform()
	{
		if(this._flags.has(Flag_Dirty)) {
			this._flags.clear(Flag_Dirty);
			
			if(! this._isProjectionMode()) {
				const angle = -Util.degreeToRadian(this._rotation);
				const cosine = Math.cos(angle);
				const sine = Math.sin(angle);
				const sxc = this._scale.x * cosine;
				const syc = this._scale.y * cosine;
				const sxs = this._scale.x * sine;
				const sys = this._scale.y * sine;
				const tx = -this._origin.x * sxc - this._origin.y * sys + this._position.x;
				const ty =  this._origin.x * sxs - this._origin.y * syc + this._position.y;

				this._matrix.set(
					sxc, -sxs, 0, 0,
					sys, syc, 0, 0,
					0, 0, 1, 0,
					tx, ty, 0, 1
				);
			}
			else {
				// "origin" is borrowed as the camera size.
				const angle = -Util.degreeToRadian(this._rotation);
				const cosine = Math.cos(angle);
				const sine = Math.sin(angle);
				let posX = this._position.x;
				let posY = this._position.y;
				posX += this._origin.x / 2;
				posY += this._origin.y / 2;
				const tx = -posX * cosine - posY * sine + posX;
				const ty =  posY * sine - posY * cosine + posY;

				// Projection components
				const a =  2.0 / (this._origin.x * this._scale.x);
				const b = -2.0 / (this._origin.y * this._scale.y);
				const c = -a * posX;
				const d = -b * posY;

				// Rebuild the projection matrix
				this._matrix.set(
					a * cosine, -b * sine, 0, 0,
					a * sine, b * cosine, 0, 0,
					0, 0, 1, 0,
					a * tx + c, b * ty + d, 0, 1
				);
			}
		}
	}

}

export { Transform };
