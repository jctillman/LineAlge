

//These function are not tested, because I've used them elsewhere
//or they are just so fucking simple that I don't need to worry about them.
//They fail in places they obviously fail.
function multiply(one, two){return one * two;}
function add(a,b){return a+b;}
function subtract(a,b){return a-b;}
function zero(){return 0;}
function equals(a,b){var tolerance = 0.00001; return a > b - tolerance && a < b + tolerance;}
function negativeWhenOdd(num){return (num % 2 == 1) ? -1 : 1}

//These are a bit more complex, but I'm still not devoting anything in the 
//test rig to them, because they should be pretty safe so long as good
//values are passed in.
var deepMap = function(arr, func){return arr.map(function(n){return Array.isArray(n) ? deepMap(n, func) : func(n); });};
var deepCollapse = function(first, second, func){
	return (Array.isArray(first))
		? first.reduce(function(old, current, index){return old.concat([deepCollapse(first[index], second[index], func)]);},[]) :
		func(first, second);
}
var flatten = function(arr){return (Array.isArray(arr)) ? arr.reduce(function(old, cur){return old.concat(flatten(cur)); },[]) : arr;}

var arrayOfFill = function(length, fill){var arr = []; for (var x = 0; x < length; x++){arr.push(fill)} return arr;};
var arrayOfArr = function(length, fill){var arr = []; for (var x = 0; x < length; x++){arr.push([])} return arr;};
var arrayOfNull = function(length){return arrayOfFill(length, null)};
var nDimensionalArray = function(n, edge){
	return	(n == 1) ?
		arrayOfNull(edge) :
		deepMap( nDimensionalArray(n-1, edge), function(n){return arrayOfNull(edge);} );
};



var Matrix = function(m){
	//If passed a two-dimensional array, just take it in.
	if(Array.isArray(m) && Array.isArray(m[0])){this.mx = m;}

	//If passed a one-dimensional array, assume it is a vector, and make it thus.
	if(Array.isArray(m) && !Array.isArray(m[0])){this.mx = m.reduce(function(old, current){return old.concat([[current]]);},[]);}

	//If passed a bunch of parameters, assume it is a vector, and make it thus.
	var args = Array.prototype.slice.call(arguments);
	if(!Array.isArray(m) && args.length > 0){this.mx = args.reduce(function(old, current){return old.concat([[current]]);},[]);}

	this.isMatrix = true;

};

var zeroMatrix = function(size){
	var temp = new Matrix();
	temp.mx = deepMap(nDimensionalArray(2, size), zero);
	return temp;
}

var diagMatrix = function(arr){
	return arr.reduce(function(old,n,i){old.mx[i][i] = n; return old;}, zeroMatrix(arr.length));
}

var identMatrix = function(size){
	return diagMatrix(arrayOfFill(size,1));
}

//Returns arrays
Matrix.prototype.rows = function(){return this.mx;} 
Matrix.prototype.cols = function(){
	return this.mx.reduce(function(past, current){
		return current.reduce(function(prior, value, index){
				prior[index].push(value);
				return prior;},
			past);}, 
		arrayOfArr(this.mx[0].length));}
Matrix.prototype.row = function(num){return this.rows()[num];}
Matrix.prototype.col = function(num){return this.cols()[num];}
Matrix.prototype.trace = function(){
	var ret = [];
	var diagDist = Math.min(this.mx.length, this.mx[0].length);
	for (var x = 0; x < diagDist; x++){
		ret.push(this.mx[x][x]);
	}
	return ret;
}

//Returns object describing it.
Matrix.prototype.dimensions = function(){return {'rows': this.mx.length, 'cols': this.mx[0].length}}
Matrix.prototype.dim = Matrix.prototype.dimensions;
Matrix.prototype.frobenius = function(){ return Math.sqrt(flatten(this.mx).reduce(function(old, n){return old + n*n;},0))}


//Returns bool
Matrix.prototype.isSquare = function(){var dimensions = this.dim(); return dimensions.rows == dimensions.cols;}

//Returns another Matrix object

//No arguments
Matrix.prototype.transpose = function(){return new Matrix(this.cols());}
Matrix.prototype.trans = Matrix.prototype.transpose;

Matrix.prototype.add = function(val){
	if (val.isMatrix){return new Matrix(deepCollapse(val.mx,this.mx,add));}
	else if(typeof val == "number"){return new Matrix(deepMap(this.mx, function(n){return n + val;}));}
}

Matrix.prototype.sub = function(val){
	if (val.isMatrix){return new Matrix(deepCollapse(this.mx,val.mx,subtract));}
	else if(typeof val == "number"){return new Matrix(deepMap(this.mx, function(n){return n - val;}));}
}

Matrix.prototype.mult = function(val){
	if (val.isMatrix){return this.multMatrix(val);}
	else if(typeof val == "number"){return new Matrix(deepMap(this.mx, function(n){return n * val;}));}
}


Matrix.prototype.multMatrix = function(val){
	var firstRowNumber = this.mx.length;
	var secondRowNumber = val.mx.length;
	var firstColNumber = this.mx[0].length;
	var secondColNumber = val.mx[0].length;
	if (firstColNumber!= secondRowNumber){return null;}
	var ret = [];
	for (var y = 0; y < firstRowNumber; y++){
		var temp = [];
		for(var x = 0; x < secondColNumber; x++){
			var firstElement = this.row(y);
			var secondElement = val.col(x);
			var added = firstElement.reduce(function(old, element, index){return old + firstElement[index] * secondElement[index]},0);
			temp.push(added);
		}
		ret.push(temp);
	}
	return new Matrix(ret); 
}

Matrix.prototype.lessPoint = function(point){
	ret = [];
	var trackY = 0;
	for (var y = 0; y < this.mx.length; y++){
		if (y != point[0]){
			ret.push([]);
			for (var x = 0; x < this.mx[0].length; x++){
				if (x != point[1]){
					ret[trackY].push(this.mx[y][x]);
				}
			}
			trackY++;
		}
	}
	return new Matrix(ret);
}

Matrix.prototype.determinant = function(){
	if (!this.isSquare()){return false;}
	var dimen = this.dimensions();
	if (dimen.rows == 1){
		var a = this.mx[0][0];
		return a;
	}else if (dimen.rows == 2){
		var a = this.mx[0][0];
		var b = this.mx[0][1];
		var c = this.mx[1][0];
		var d = this.mx[1][1];
		return a * d - b * c;
	}else if (dimen.rows >= 3){
		var self = this;
		return this.row(0).reduce(function(prior, current, index){
			return prior + negativeWhenOdd(index) * current * self.lessPoint([0,index]).determinant();
		},0);
	}
}
Matrix.prototype.det = Matrix.prototype.determinant;










var Vector = function(arr){Matrix.call(this, arr);this.isVector = true;}
Vector.prototype = Object.create(Matrix.prototype);
Vector.prototype.constructor = Vector;

Vector.prototype.lpNorm = function(p){return Math.pow(this.col(0).reduce(function(old, current){return old + Math.pow(current, p);},0),1/p);}
Vector.prototype.maxNorm = function(p){return this.col(0).reduce(function(old, current){return Math.max(old, current);},-100000)}
Vector.prototype.euclideanNorm = function(){return this.lpNorm(2);}
Vector.prototype.dot = function(vect){
	if(!vect.isVector){return false;}
	var oneDim = this.dimensions();
	var twoDim = vect.dimensions();
	if(oneDim.cols > 1 || twoDim.cols > 1 || oneDim.rows != twoDim.rows){return false;}
	return this.transpose().mult(vect).mx[0][0];
}

Vector.prototype.cross = function(){
	var vectors = Array.prototype.slice.call(arguments);
	if (vectors.some( function(vector){ return vector.isVector != true || vector.dimensions().rows != vectors.length + 2} )){return false;}

	var matrix = [[]];
	for (var x = 0; x < this.mx.length; x++){matrix[0].push(negativeWhenOdd(x));}
	matrix.push(this.col(0));
	for (var x = 0; x < vectors.length; x++){matrix.push(vectors[x].col(0));}
	var m = new Matrix(matrix);

	var answer = [];
	for (var x = 0; x < this.mx.length; x++){
		answer.push( m.lessPoint([0,x]).det() * m.mx[0][x]);
	}
    
	return new Vector(answer);	
}

Vector.prototype.isOrthogonalTo = function(vect){
	if(!vect.isVector){return false;}
	return equals(this.dot(vect),0) ;
}

Vector.prototype.isOrthonormalTo = function(vect){
	return equals(this.dot(vect),0) && this.isUnit() && vect.isUnit() ;
}

/*
function vectorCrossProduct(){
	var args = Array.prototype.slice.apply(arguments);
	var args = args.map(function(n){return matrixTranspose(n)[0]});
	if (args.length - 1 > args[0].length){return false;}
	
	var matrix = [[]]
	for (var x = 0; x < args[0].length; x++){
		matrix[0].push(negativeWhenOdd(x));
	}
	for (var x = 0; x < args.length; x++){
		matrix.push(args[x]);
	}
	//console.log(matrix);
	var answer = [];
	for (var x = 0; x < args[0].length; x++){
		answer.push( matrixDeterminant(matrixReduction(matrix, [0,x])) * matrix[0][x] );
	}
	return makeVector(answer);

}*/


Vector.prototype.isUnit = function(){return equals(this.lpNorm(2),1);}



module.exports = {
	'Matrix': Matrix,
	'zeroMatrix': zeroMatrix,
	'identMatrix': identMatrix,
	'diagMatrix': diagMatrix,

	'Vector': Vector
}