//These function are not tested, because I've used them elsewhere
//or they are just so simple that I don't need to worry about them.

//The really simple ones.
function multiply(one, two){return one * two;}
function add(a,b){return a+b;}
function subtract(a,b){return a-b;}
function arr(){return [];}
function zero(){return 0;}
function one(){return 1;}


//Not so simple, but pretty simple.
function equals(a,b,tolerance){
	var tolerance = tolerance || 0.00001;
	return a >= b - tolerance && a <= b + tolerance;
}
function negativeWhenOdd(num){
	return (num % 2 == 1) ? -1 : 1;
}
function objPropReturn(obj, prop, val){
	obj[prop] = val;
	return obj;
}


//Less simple, but so extensively used I see no need for tests.
//Deep map works like map, but can be used on arbitrarily nested arrays.
var deepMap = function(arr, func){
	return arr.map(function(n){return Array.isArray(n) ? deepMap(n, func) : func(n); });
};
var deepCollapse = function(first, second, func){
	return (Array.isArray(first))
		? first.reduce(function(old, current, index){return old.concat([deepCollapse(first[index], second[index], func)]);},[])
		: func(first, second);
};
var deepEquals = function(obj1,obj2){
		return (Array.isArray(obj1))
				? obj1.every(function(n,i){return deepEquals(obj1[i], obj2[i]);})
				: equals(obj1, obj2);
};
var flatten = function(arr){
	return (Array.isArray(arr))
		? arr.reduce(function(old, cur){return old.concat(flatten(cur)); },[])
		: arr;
};
var permuteCompare = function(array, func){
	element = array.pop();
	return (array.length == 0)
		? true
		: array.every(function(el){return func(element, el);}) && permuteCompare(array, func);
};
var arrayOfFill = function(length, fill){
	var arr = [];
	for (var x = 0; x < length; x++){
		arr.push(fill(x))
	}
	return arr;
};
var arrayOfNull = function(length){
	return arrayOfFill(length, function(){return null;})
};
var nByMFill = function(n,m,fill){
	var arr = [];
	for(var y = 0; y < n; y++){
		arr.push([]);
		for (var x = 0; x < m; x++){
			arr[y].push(fill(y,x));}}
	return arr;
};
var rangeReduce = function(range, func, start){
	for(var x = 0; x < range; x++){
		start = func(x, start);
	}
	return start;
};
var subArray = function(twoDArr, yStart,yEnd,xStart,xEnd){
	var ret = [];
	var yTrack = 0;
	for (var y = yStart; y < yEnd; y++){
		ret.push([]);
		var xTrack = 0;
		for (var x = xStart; x < xEnd; x++){
			ret[yTrack].push(twoDArr[y][x]);
			xTrack++;
		}
		yTrack++;
	}
	return ret;
}
var splitSquareArr = function(mat){
	var rows = mat.length;
	var cols = mat[0].length;
	var middle = Math.round(mat.length/2);
	var a = subArray(mat, 0, middle, 0, middle);
	var b = subArray(mat, 0, middle, middle, cols );
	var c = subArray(mat, middle, rows, 0, middle);
	var d = subArray(mat, middle, rows, middle, cols );
	return [a, b, c, d]
}
var joinArr = function(a,b,c,d){
	var ret = [];
	for (var y = 0; y < a.length + c.length; y++){
		ret.push([]);
		for (var x = 0; x < a[0].length + b[0].length; x++){
			if(y < a.length){
				if (x < a[0].length){
					ret[y].push(a[y][x]);
				}else{
					ret[y].push(b[y][x-a[0].length]);
				}
			}else{
				if (x < a[0].length){
					ret[y].push(c[y-a.length][x]);
				}else{
					ret[y].push(d[y-a.length][x-a[0].length]);
				}
			}
		}
	}
	return ret;
}





//Actually important thing
//This is the matrix, basically a holder for data and functions so that the
//functions can be chained.
//NONE OF THE METHODS SHOULD MODIFY ANYTHING IN IT.
//EVER
//The preferred way of working is to make a new matrix for every stage of work.
var Matrix = function(m){
	//If passed a two-dimensional array, just take it in.
	if(Array.isArray(m) && Array.isArray(m[0])){
		this.mx = m;};

	//If passed a one-dimensional array, assume it is a vertical vector, a matrix of one column, and make it thus.
	if(Array.isArray(m) && !Array.isArray(m[0])){
		this.mx = m.reduce(function(old, current){return old.concat([[current]]);},[]);};

	//If passed a bunch of parameters, assume it is a vertical vector, a matrix of one column, and make it thus.
	var args = Array.prototype.slice.call(arguments);
	if(!Array.isArray(m) && args.length > 0){
		this.mx = args.reduce(function(old, current){return old.concat([[current]]);},[]);}

	this.isMatrix = true;

};



//Alternative construction methods.
var zeroMatrix = function(sizeRow, sizeCol){
	if (!sizeCol){
		return objPropReturn(new Matrix(), 'mx', nByMFill(sizeRow, sizeRow, zero));
	}else{
		return objPropReturn(new Matrix(), 'mx', nByMFill(sizeRow, sizeCol, zero));
	}
}
var diagMatrix = function(arr){
	return arr.reduce(function(old,n,i){old.mx[i][i] = n; return old;}, zeroMatrix(arr.length));
}
var identMatrix = function(size){
	return diagMatrix(arrayOfFill(size,one));
}



//Ways of returning arrays.
Matrix.prototype.rows = function(){
	return this.mx.slice();
} 
Matrix.prototype.cols = function(){
	return this.mx.reduce(function(past, current){
		return current.reduce(function(prior, value, index){
				prior[index].push(value);
				return prior;},
			past);}, 
		arrayOfFill(this.mx[0].length, arr));
}
Matrix.prototype.row = function(num){
	return this.rows()[num];
}
Matrix.prototype.col = function(num){
	return this.cols()[num];
}
Matrix.prototype.trace = function(){
	var self = this;
	return rangeReduce( Math.min(this.mx.length, this.mx[0].length), function(i, old){
		return old.concat(self.mx[i][i]);
	}, []);
}


//Returns object describing it the matrix.
Matrix.prototype.dimensions = function(){
	return {'rows': this.mx.length, 'cols': this.mx[0].length};
}
Matrix.prototype.dim = Matrix.prototype.dimensions;
Matrix.prototype.frobenius = function(){
	return Math.sqrt(flatten(this.mx).reduce(function(old, n){return old + n*n;},0));
}


//Returns bool

Matrix.prototype.isSquare = function(){
	var dimensions = this.dim();
	return dimensions.rows == dimensions.cols;
}
Matrix.prototype.equals = function(mat){
	var thisDim = this.dimensions();
	var otherDim = mat.dimensions();
	if (thisDim.rows != otherDim.rows || thisDim.cols != otherDim.cols){return false;}
	return deepEquals(this.mx, mat.mx);
}
Matrix.prototype.eq = Matrix.prototype.equals;
Matrix.prototype.isSymmetric = function(){
	return this.equals(this.transpose());
}
Matrix.prototype.isOrthogonal = function(){
	if(!this.isSquare()){return false;}
	if(!permuteCompare(this.rows(), function(a,b){return new Vector(a).isOrthonormalTo(new Vector(b));})){return false;}
	if(!permuteCompare(this.cols(), function(a,b){return new Vector(a).isOrthonormalTo(new Vector(b));})){return false;}
	return true;
}




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

Matrix.prototype.piecewise = function(func){
	return new Matrix(deepMap(this.mx, func));
}

Matrix.prototype.neg = function(){
	return this.mult(-1);
}

Matrix.prototype.multMatrix = function(val){
	var self = this;
	return new Matrix(this.rows().reduce(function(past, row, i){
		return past.concat([val.cols().reduce(function(prior, col, j){
			  var col = val.col(j);
			  var added = self.row(i).reduce(function(old, rowElement, index){return old + rowElement * col[index]},0);
		      return prior.concat(added);//	return prior.concat(row.reduce(function(old, element, index){return old + element * val.col(index)}, 0));
		}, [])]);
	},[]));
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

Matrix.prototype.hadamard = function(mat){
	var first = this.dimensions();
	var second = mat.dimensions();
	if(!mat.isMatrix || first.rows != second.rows || first.cols != second.cols){return false;}
	return new Matrix(deepCollapse(this.mx, mat.mx, multiply));
}




Matrix.prototype.determinant = function(){
	if (!this.isSquare()){return false;}
	if (this.dimensions().rows == 1){
		return this.mx[0][0];
	}else{
		var self = this;
		return this.row(0).reduce(function(prior, current, index){
			return prior + negativeWhenOdd(index) * current * self.lessPoint([0,index]).determinant();
		},0);
	}
}
Matrix.prototype.det = Matrix.prototype.determinant;

Matrix.prototype.inverse = function(){
	var dimensions = this.dimensions()
	var determinant = this.determinant();
	if(!this.isSquare() || determinant == 0){
		return false;
	}
	else if(dimensions.rows == 1){
		return new Matrix([[1/this.mx[0][0]]]);
	}
	else if(dimensions.rows == 2){
		var a = this.mx[0][0];
		var b = this.mx[0][1];
		var c = this.mx[1][0];
		var d = this.mx[1][1];
		var ret = new Matrix([[d,-b],[-c,a]])
		return ret.mult(1/ret.det());
	}else if(dimensions.rows >= 3){
		var subArr = splitSquareArr(this.mx);
		var a = new Matrix(subArr[0]);
		var b = new Matrix(subArr[1]);
		var c = new Matrix(subArr[2]);
		var d = new Matrix(subArr[3]);
		var aInverse = a.inverse();
		var temp = d.sub(c.mult(aInverse).mult(b)).inverse();
		var a1 = aInverse.add(aInverse.mult(b).mult(temp).mult(c).mult(aInverse));
		var b1 = aInverse.neg().mult(b).mult(temp);
		var c1 = temp.neg().mult(c).mult(aInverse);
		var d1 = temp;
		return new Matrix(  joinArr(a1.mx, b1.mx, c1.mx, d1.mx)  );
	}
}


//
Matrix.prototype.rowSwap = function(a,b){
	var repl = this.mx.slice()
	var temp = this.mx.slice()[a];
	repl[a] = repl[b].slice()
	repl[b] = temp;
	return new Matrix(repl);

}

Matrix.prototype.rowMult = function(row, val){
	var repl = this.mx.slice();
	repl[row] = repl[row].map(function(n){return n * val;});
	return new Matrix(repl);
}

Matrix.prototype.rowAdd = function(altered, altering){

	var repl = this.mx.slice();
	repl[altered] = repl[altered].map(function(n,i){ return n + repl[altering][i]});
	return new Matrix(repl);

}

Matrix.prototype.gaussJordan = function(augmented){
	var current = this;
	var i = 0;
	var j = 0;
	while(i < current.mx.length && j < ( current.mx[0].length - ( (augmented) ? 1 : 0 ) ) ) {

		var thisRowAllZeros = current.row(i).every(function(n){return n == 0;});
		var nextNonZeroColElement = current
			.col(j)
			.reduce(function(_, val, ind){ return (val != 0 && ind > i) ? ind : _ ; }, i);

		if (current.mx[i][j] == 0 && nextNonZeroColElement != i){
			current = current.rowSwap(nextNonZeroColElement, i)
		}else if(thisRowAllZeros){
			i = i + 1;
		}else if (current.mx[i][j] == 0){
			j = j + 1;
		}else{
			current = current.rowMult(i, 1/current.mx[i][j]);
			for(var x = 0; x < current.mx.length; x++){
				if (current.mx[x][j] != 0 && x != i){
					var val = -current.mx[x][j]
					current = current.rowMult(i, -current.mx[x][j] )
					current = current.rowAdd( x,  i )
					current = current.rowMult(i, 1/val);
				}
			}
			i = i + 1;
			j = j + 1;
		}
	}
	return current

}

Matrix.prototype.rowEquivalent = function(other){
	if (this.dimensions().rows != other.dimensions().rows || this.dimensions().cols != other.dimensions().cols ){return false;}
	return this.gaussJordan().eq(other.gaussJordan());
}

Matrix.prototype.rowEquiv = Matrix.prototype.rowEquivalent;









var Vector = function(arr){
	if(Array.isArray(arr)){
		Matrix.call(this, arr);}
	else{
		Matrix.call(this, Array.prototype.slice.call(arguments));}
	this.isVector = true;
}
Vector.prototype = Object.create(Matrix.prototype);
Vector.prototype.constructor = Vector;


Vector.prototype.lpNormPowered = function(p){return this.col(0).reduce(function(old, current){return old + Math.pow(current, p);},0);}
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

Vector.prototype.isUnit = function(){return equals(this.lpNorm(2),1);}

//Converts the vector into a normalized probability function
Vector.prototype.softMax = function(){
	var sum = this.col(0).reduce(function(total, current, i){return total + Math.exp(current)}, 0);
	return new Vector( this.col(0).map(function(current, i){ return Math.exp(current) / sum}));
}




module.exports = {
	'Matrix': Matrix,
	'zeroMatrix': zeroMatrix,
	'identMatrix': identMatrix,
	'diagMatrix': diagMatrix,
	'Vector': Vector
}