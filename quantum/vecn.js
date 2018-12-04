function vecn(x){
	this.x = x;
	this.n = x.length;
}
vecn.prototype = {
	length: function(){
		return Math.sqrt( this.x.reduce( (sum, x0) => { return sum + x0*x0 }, 0 ) );
	},
	length_2: function(){
		return this.x.reduce( (sum, x0) => { return sum + x0*x0 }, 0 );
	},
	dist: function(v){
		return this.subtract(v).length();
	},
	dist_2: function(v){
		return this.subtract(v).length_2();		
	},
	normalise: function(){
		var s = 1/this.length();
		return new vecn( this.x.map( x0 => x0*s ) );
	},
	sNormalise: function(){
		var s = 1/this.length();
		this.x = this.x.map( x0 => x0*s );
		return this;
	},
	setLength: function(s){
		this.sScale( s/this.length() );
		return this;
	},
	add: function(v){
		return new vecn( this.x.map( (x0, index) => x0 + v.x[ index ] ) );
	},
	sAdd: function(v){
		this.x = this.x.map( (x0, index) => x0 + v.x[ index ] );
		return this;
	},
	subtract: function(v){
		return new vecn( this.x.map( (x0, index) => x0 - v.x[ index ] ) );
	},
	sSubtract: function(v){
		this.x = this.x.map( (x0, index) => x0 - v.x[ index ] );
		return this;
	},
	scale: function(s){
		return new vecn( this.x.map( x0 => x0*s ) );
	},
	sScale: function(s){
		this.x = this.x.map( x0 => x0*s );
		return this;
	},
	mult: function(v){
		return new vecn( this.x.map( (x0, index) => x0*v.x[ index ] ) );
	},
	sMult: function(v){
		this.x = this.x.map( (x0, index) => x0*v.x[ index ] );
		return this;
	},
	divide: function(v){
		return new vecn( this.x.map( (x0, index) => x0/v.x[ index ] ) );
	},
	sDivide: function(v){
		this.x = this.x.map( (x0, index) => x0/v.x[ index ] );
		return this;
	},
	angleWith: function(v){
		return Math.acos(this.dot(v)/( this.length()*v.length() ));
	},
	equals: function(v){
		return this.x.every( (x0, index) => { return x0 == v.x[index] } );
	},
	set: function(x){
		this.x = x.concat([]);
		return this;
	},
	c: function(){
		return new vec2(this.x);
	},
	clone: function(){
		return new vec2(this.x);
	},
	swizzle: function(str){
		//TODO
		var arr = str.split('').map((c) => {return this[c];});
		arr = arr.filter((item) => {typeof item !== 'undefined'});
		switch(arr.length){
			case 2:
				return new vec2(arr[0], arr[1]);
			case 3:
				return new vec3(arr[0], arr[1], arr[2]);
			default:
				return new vecn(arr);
				//bestaat nog niet
		}
	},
	rotateArray: function(shifts=0){
		return new vecn( this.x.slice(shifts, this.n).concat(this.x.slice(0, shifts)) );
	},
	dot: function(v){
		return this.x.reduce( ( sum, x0, index) => { return sum + x0*v.x[index] }, 0 );
	},
	projectOn: function(v){
		return v.scale(this.dot(v)/v.length_2());
	},
	rejectOn: function(v){
		return this.subtract( this.projectOn(v) );
	}
};
vecn.random = function(n){
	return new vecn( new Array(n).fill(0).map( Math.random ) );
};
vecn.random2 = function(n, a, b){
	var range = b - a;
	return new vecn( new Array(n).fill(0).map( x0 => { return Math.random()*range - a; } ) );
};
vec2.randomUnit = function(thetaMin=0, thetaMax=2*Math.PI){
	//TODO
	return vec2.fromPolar(Math.random()*thetaMax + thetaMin);
};
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