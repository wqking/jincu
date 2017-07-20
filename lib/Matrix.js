import { mat4 } from './thirdparty/gl-matrix/mat4.js';
import { vec3 } from './thirdparty/gl-matrix/vec3.js';

import { Util } from './util/Util.js';
import { Point, Scale } from './Geometry.js';

class Matrix
{
	static getIdentity()
	{
		return Matrix._identity;
	}
	
	static createIdentity()
	{
		return new Matrix(mat4.create());
	}
	
	constructor(_mat)
	{
		this._glMatrix = _mat || mat4.create();
		this._canvas2DBuffer = new Array(6);
	}
	
	assignFrom(other)
	{
		mat4.copy(this._glMatrix, other._glMatrix);

		return this;
	}
	
	clone()
	{
		return new Matrix(mat4.clone(this._glMatrix));
	}
	
	equals(other)
	{
		return mat4.equals(this._glMatrix, other._glMatrix);
	}

	// Row major, dx, dy, dz are at m30, m31, and m32
	set(
			m00, m01, m02, m03,
			m10, m11, m12, m13,
			m20, m21, m22, m23,
			m30, m31, m32, m33
		)
	{
		mat4.set(this._glMatrix,
			m00, m01, m02, m03,
			m10, m11, m12, m13,
			m20, m21, m22, m23,
			m30, m31, m32, m33
		);
	}
	
	translate(point)
	{
		Matrix._translateV3[0] = point.x || 0;
		Matrix._translateV3[1] = point.y || 0;
		Matrix._translateV3[2] = point.z || 0;
		
		mat4.translate(this._glMatrix, this._glMatrix, Matrix._translateV3);

		return this;
	}
	
	scale(scaleValue)
	{
		Matrix._scaleV3[0] = scaleValue.x || 0;
		Matrix._scaleV3[1] = scaleValue.y || 0;
		Matrix._scaleV3[2] = scaleValue.z || 1;
		
		mat4.scale(this._glMatrix, this._glMatrix, Matrix._scaleV3);

		return this;
	}
	
	rotate(degree)
	{
		Matrix._rotateV3[0] = 0;
		Matrix._rotateV3[1] = 0;
		Matrix._rotateV3[2] = 1;

		mat4.rotate(this._glMatrix, this._glMatrix, Util.degreeToRadian(degree), Matrix._rotateV3);

		return this;
	}
	
	invert()
	{
		mat4.invert(this._glMatrix, this._glMatrix);

		return this;
	}
	
	multiply(other)
	{
		mat4.multiply(this._glMatrix, this._glMatrix, other._glMatrix);

		return this;
	}
	
	transformPoint(point, out)
	{
		Matrix._transformPointV3[0] = point.x;
		Matrix._transformPointV3[1] = point.y;
		Matrix._transformPointV3[2] = point.z;
		
		vec3.transformMat4(Matrix._transformPointV3, Matrix._transformPointV3, this._glMatrix);
		out = out || new Point();
		out.x = Matrix._transformPointV3[0];
		out.y = Matrix._transformPointV3[1];
		out.z = Matrix._transformPointV3[2];
		return out;
	}
	
	toString()
	{
		let result = '';
		result += this._glMatrix[0] + ' ' + this._glMatrix[1] + ' ' + this._glMatrix[2] + ' ' + this._glMatrix[3] + "\n";
		result += this._glMatrix[4] + ' ' + this._glMatrix[5] + ' ' + this._glMatrix[6] + ' ' + this._glMatrix[7] + "\n";
		result += this._glMatrix[8] + ' ' + this._glMatrix[9] + ' ' + this._glMatrix[10] + ' ' + this._glMatrix[11] + "\n";
		result += this._glMatrix[12] + ' ' + this._glMatrix[13] + ' ' + this._glMatrix[14] + ' ' + this._glMatrix[15];
		return result;
	}

	// return [ a, b, c, d, e, f ] which can be used in setTransform
	toCanvas2D(buffer)
	{
		buffer = buffer || this._canvas2DBuffer;
		for(let i = 0; i < 6; ++i) {
			buffer[i] = this._glMatrix[Matrix._canvas2DIndexes[i]];
		}
	
		return buffer;
	}

}

Matrix._identity = new Matrix();
Matrix._translateV3 = vec3.create();
Matrix._scaleV3 = vec3.fromValues(1, 1, 1);
Matrix._rotateV3 = vec3.create();
Matrix._transformPointV3 = vec3.create();

Matrix._canvas2DIndexes = [ 0, 1, 4, 5, 12, 13 ];

let _getDecompositedScaleV3 = new Point();
let _cachedDecompositedScale = new Scale();
function getDecompositedScale(matrix)
{
	_getDecompositedScaleV3.x = 0;
	_getDecompositedScaleV3.y = 0;
	const p1 = matrix.transformPoint(_getDecompositedScaleV3);

	_getDecompositedScaleV3.x = 1;
	_getDecompositedScaleV3.y = 0;
	const p2 = matrix.transformPoint(_getDecompositedScaleV3);

	_getDecompositedScaleV3.x = 0;
	_getDecompositedScaleV3.y = 1;
	const p3 = matrix.transformPoint(_getDecompositedScaleV3);

	_cachedDecompositedScale.x = p2.x - p1.x;
	_cachedDecompositedScale.y = p3.y - p1.y;
	return _cachedDecompositedScale;
}

export { Matrix, getDecompositedScale };
