/*
author: Bram Verreussel
*/

class vecn extends Array{
	constructor(...a){
		if(a.length == 1){
			super(1);
			this[0] = a[0];
		}else{
			super(...a)
		}
	}
	add(v){
		return this.map( (x0, index) => x0 + v[ index ] ) ;
	}
	sAdd(v){
		this.forEach( function(x0, index, arr){
			arr[index] += v[ index ];
		});
		return this;
	}
	subtract(v){
		return this.x.map( (x0, index) => x0 - v[ index ] );
	}
	sSubtract(v){
		this.forEach( function(x0, index, arr){
			arr[index] -= v[ index ];
		});
		return this;
	}
	scale(s){
		return this.map( x0 => x0*s );
	}
	sScale(s){
		this.forEach( function(x0, index, arr){
			arr[index] *= s;
		});
		return this;
	}
	mult(v){
		return this.map( (x0, index) => x0*v[ index ] );
	}
	sMult(v){
		this.forEach( function(x0, index, arr){
			arr[index] *= v[index];
		});
		return this;
	}
	divide(v){
		return this.map( (x0, index) => x0/v[ index ] );
	}
	sDivide(v){
		this.forEach( function(x0, index, arr){
			arr[index] /= v[index];
		});
		return this;
	}
	norm(){
		return Math.sqrt( this.x.reduce( (sum, x0) => sum + x0*x0, 0 ) );
	}
	norm_2(){
		return this.reduce( (sum, x0) => sum + x0*x0, 0 );
	}
	dist(v){
		return this.subtract(v).norm();
	}
	dist_2(v){
		return this.subtract(v).norm_2();		
	}
	normalise(){
		var s = 1/this.length();
		return this.scale(s);
	}
	sNormalise(){
		var s = 1/this.length();
		this.sScale(s);
		return this;
	}
	setNorm(s){
		this.sScale( s/this.length() );
		return this;
	}
	dot(v){
		return this.reduce( ( sum, x0, index) =>  sum + x0*v[index], 0 );
	}
	projectOn(v){
		return v.scale( this.dot(v)/v.length_2() );
	}
	rejectOn(v){
		return this.subtract( this.projectOn(v) );
	}
	angleWith(v){
		return Math.acos( this.dot(v)/( this.length()*v.length() ) );
	}
	equals(v){
		return this.every( (x0, index) => { return x0 === v[index] } );
	}
	set(v){
		this.forEach( function(x0, index, arr){
			arr[index] = v[ index ];
		});
	}
	c(){
		return this.concat([]);
	}
	clone(){
		return this.concat([]);
	}
	repeat(n=2){
		return vecn.zeros(n).fill( this ).flat();
	}
	rotateArray(shift=1){
		return new vecn(...this.slice(shift, this.length), ...this.slice(0, shift));
	}
	sRotateArray(shift=1){
		const len = this.length;
		this.push(...this.splice(0, (-shift % len + len) % len));
		return this;
	}
	static zeros(n){
		return new Array(n).fill(0);
	}
	static ones(n){
		return new Array(n).fill(1);
	}
	static random(n){
		return new vecn( ... new Array(n).fill(0).map( Math.random ) )
	}
	static randomRange(n, a=-1, b=1){
		var range = b - a;
		return new vecn( ... new Array(n).fill(0).map( x => range*Math.random() + a ) );
	}
	static randomGaussian(n){
		var n2 = Math.round( (n + .1)/2 );

		var U1 = vecn.random(n2);
		var U2 = vecn.random(n2);
		var R = U1.map( x => { 
			return Math.sqrt( -2*Math.log( U1 ) ) 
		} );
		var Z1 = R.scale( U2.map( Math.cos ) );
		var Z2 = R.scale( U2.map( Math.sin ) );
		return Z2.concat( Z1 ).slice(1);
	}
}	
/*
vecn.make = function(n){
	var arr = [];
	for(var i=1; i<arguments.length && arr.length < n; i++){
		if(typeof arguments[i].x === 'number'){ //check for vec2, vec3 like objects
			arr.push(arguments[i].x);
			if(typeof arguments[i].y === 'number'){
				arr.push(arguments[i].y);
				if(typeof arguments[i].z === 'number'){
					arr.push(arguments[i].z);
				}
			}
		}else if(typeof arguments[i].x !== 'undefined' && typeof arguments[i].x.length !== 'undefined' && arguments[i].x.length > 0){ //check for vecn like objects
			for(let j=0; j<arguments[i].x.length; j++){
				arr.push(arguments[i].x[j]);
			}
		}else if(typeof arguments[i].length !== 'undefined' && arguments[i].length > 0){ //check for arrays
			for(let j=0; j<arguments[i].length; j++){
				arr.push(arguments[i][j]);
			}
		}else if(typeof arguments[i] == 'number'){ //check for plain numbers
			arr.push(arguments[i]);
		}
	}
	if(arr.length == 0){ //if no numbers are found the first number will be zero
		arr[0] = 0;
	}
	while( arr.length < n ){ //if array is too short the remainder will be padded with last element
		arr[ arr.length ] = arr[ arr.length - 1];
	}
	if( arr.length > n){ //if the array is too long discard the last past
		arr = arr.slice( 0, n );
	}
	return new vecn( arr );
};
*/
class vec2 extends vecn {
	constructor(x, y){
		super(x, y)
	}
	get x(){
		return this[0];
	}
	get y(){
		return this[1];
	}
	set x(val){
		this[0] = val;
	}
	set y(val){
		this[1] = val;
	}
	norm(){
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}
	norm_2(){
		return this.x*this.x + this.y*this.y;
	}
	dist(v){
		return this.subtract(v).length();
	}
	dist_2(v){
		return this.subtract(v).length_2();		
	}
	normalise(){
		var l = 1/this.length();
		return new vec2(this.x*l, this.y*l);
	}
	sNormalise(){
		var l = 1/this.length();
		this.x *= l;
		this.y *= l;
		return this;
	}
	setLength(s){
		this.sScale( s/this.length() );
		return this;
	}
	add(v){
		return new vec2(this.x + v.x, this.y + v.y);
	}
	sAdd(v){
		this.x += v.x;
		this.y += v.y;
		return this;
	}
	subtract(v){
		return new vec2(this.x - v.x, this.y - v.y);
	}
	sSubtract(v){
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}
	scale(s){
		return new vec2(this.x*s, this.y*s);
	}
	sScale(s){
		this.x *= s;
		this.y *= s;
		return this;
	}
	mult(v){
		return new vec2(this.x*v.x, this.y*v.y);
	}
	sMult(v){
		this.x *= v.x;
		this.y *= v.y;
	}
	divide(v){
		return new vec2(this.x/v.x, this.y/v.y);
	}
	sDivide(v){
		this.x /= v.x;
		this.y /= v.y;
	}
	rotate(angle){
		var cosa = Math.cos(angle);
		var sina = Math.sin(angle);
		return new vec2(this.x*cosa - this.y*sina, this.x*sina + this.y*cosa);
	}
	sRotate(angle){
		var cosa = Math.cos(angle);
		var sina = Math.sin(angle);
		var oldx = this.x;
		this.x = this.x*cosa - this.y*sina;
		this.y =   oldx*sina + this.y*cosa;
		return this;
	}
	angleWith(v){
		return Math.acos(this.dot(v)/( this.length()*v.length() ));
	}
	angle(){
		return Math.atan2( this.y, this.x );
	}
	equals(v){
		return this.x === v.x && this.y === v.y;
	}
	set(x, y){
		this.x = x;
		this.y = y;
		return this;
	}
	c(){
		return new vec2(this.x, this.y);
	}
	clone(){
		return new vec2(this.x, this.y);
	}
	swizzle(str){
		var arr = str.split('').map((c) => {return this[c];});
		arr = arr.filter((item) => {typeof item !== 'undefined'});
		switch(arr.length){
			case 2:
				return new vec2(arr[0], arr[1]);
			case 3:
				return new vec3(arr[0], arr[1], arr[2]);
			default:
				return new vecn(...arr);
				//bestaat nog niet
		}
	}
	addPolar(theta, r){
		return this.add(vec2.fromPolar(theta, r));
	}
	dot(v){
		return this.x*v.x + this.y*v.y;
	}
	cross(v){
		return this.x*v.y - this.y*v.x;
	}
	crossWithZ(z){
		return new vec2(this.y*z, -this.x*z);
	}
	projectOn(v){
		return v.scale(this.dot(v)/v.length_2());
	}
	rejectOn(v){
		return this.subtract( this.projectOn(v) );
	}
	draw(ctx, startPos, scale, arrowHeadLength, arrowAngle){
		var scale = (typeof scale == 'undefined')? 1 : scale;
		var v = this.scale(scale);
		var endPos = startPos.add(v);
		var arrowHeadLength = (typeof arrowHeadLength=="undefined")? 15 : arrowHeadLength;
		var l = v.length();
		arrowHeadLength = Math.min(arrowHeadLength, l*.5);
		var arrowAngle = (typeof arrowAngle=="undefined")? .4 : arrowAngle;
		var angle = Math.atan2(v.y, v.x);
		
		ctx.beginPath();
		ctx.moveTo(startPos.x, startPos.y);
		ctx.lineTo(endPos.x, endPos.y);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(endPos.x, endPos.y);
		ctx.lineTo(endPos.x + arrowHeadLength*Math.cos(Math.PI + angle - arrowAngle), endPos.y + arrowHeadLength*Math.sin(Math.PI + angle - arrowAngle));
		ctx.lineTo(endPos.x + arrowHeadLength*Math.cos(Math.PI + angle + arrowAngle), endPos.y + arrowHeadLength*Math.sin(Math.PI + angle + arrowAngle));
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}
	
}
