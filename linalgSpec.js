

var lg = require('./linalg.js');

describe(' Matrix makes acceptable matrices', function(){

	it(' works while making matrices from complete values', function(){
		var M = new lg.Matrix([[1,1],[1,1]]);
		expect(M.mx).toEqual([[1,1],[1,1]]);
	});

	it(' works while making an array from a vector', function(){
		var M = new lg.Matrix([1,1,1,1]);
		expect(M.mx).toEqual([[1],[1],[1],[1]]);
	});

	it(' works while making an array from a vector', function(){
		var M = new lg.Matrix(1,1,1,1);
		expect(M.mx).toEqual([[1],[1],[1],[1]]);
	});

	it(' makes zero Matrices', function(){
		var M = lg.zeroMatrix(1);
		var N = lg.zeroMatrix(3);
		expect(M.mx).toEqual([[0]]);
		expect(N.mx).toEqual([[0,0,0],[0,0,0],[0,0,0]]);
	});

	it(' makes diag Matrices', function(){
		var M = lg.diagMatrix([1,2,3]);
		var N = lg.diagMatrix([1,2,3,4]);
		expect(M.mx).toEqual([[1,0,0],[0,2,0],[0,0,3]]);
		expect(N.mx).toEqual([[1,0,0,0],[0,2,0,0],[0,0,3,0],[0,0,0,4]]);
	});

	it(' makes identity Matrices', function(){
		var M = lg.identMatrix(3);
		var N = lg.identMatrix(4);
		expect(M.mx).toEqual([[1,0,0],[0,1,0],[0,0,1]]);
		expect(N.mx).toEqual([[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]);
	});

});


describe(' operations that return bools', function(){
	it(' returns bools', function(){
		var A = new lg.Matrix([[1,1],[2,2]]);
		var B = new lg.Matrix([[1,1,1],[2,2,2]]);
		expect(A.isSquare()).toBe(true);
		expect(B.isSquare()).toBe(false);
	});
});



describe(' operations that return arrays', function(){

	it(' gets rows', function(){
		var M = new lg.Matrix([[1,1,1],[2,2,2]]);
		expect(M.rows()).toEqual([[1,1,1],[2,2,2]]);
		expect(M.row(0)).toEqual([1,1,1]);
		expect(M.row(1)).toEqual([2,2,2]);
	});

	it(' gets columns', function(){
		var M = new lg.Matrix([[1,1,1],[2,2,2]]);
		expect(M.cols()).toEqual([[1,2],[1,2],[1,2]]);
		expect(M.col(0)).toEqual([1,2]);
		expect(M.col(1)).toEqual([1,2]);
	});

	it(' reports dimensions', function(){
		var N = new lg.Matrix([[1,2],[3,4],[5,6]]).dim();
		expect(N.rows).toEqual(3);
		expect(N.cols).toEqual(2);
	});

	it(' gets trace', function(){
		var M = new lg.Matrix([[1,2,3],[4,5,6]]);
		expect(M.trace()).toEqual([1,5]);
	});

});


describe('matrix operations that return scalars', function(){
	it(' returns frobenius', function(){
		var M = new lg.Matrix([[2,2],[2,2]]);
		expect(M.frobenius()).toEqual(4);
	});
	it(' says which determinants do not work correctly', function(){
		var A = new lg.Matrix([[1,1,1],[2,2,2]]);
		expect(A.det()).toBe(false);
	});
	it(' determinants works for 2 x 2 matrices', function(){
		var A = new lg.Matrix([[1,1],[2,2]]);
		var B = new lg.Matrix([[1,0],[0,1]]);
		var C = new lg.Matrix([[5,4],[4,5]]);
		expect(A.det()).toBe(0);
		expect(B.det()).toBe(1);
		expect(C.det()).toBe(9);
	});
	it(' determinants works for 3 x 3 matrices', function(){
		var A = new lg.Matrix([[6,1,1],[4,-2,5],[2,8,7]])
		var B = new lg.Matrix([[1,5,3],[2,4,7],[4,6,2]])
		expect(A.det()).toBe(-306);
		expect(B.det()).toBe(74);
	});
	it(' determinants works for 4 x 4 matrices', function(){
		var A = new lg.Matrix([[2,5,3,5],[14,9,6,7],[4,9,3,2],[3,7,8,6]]);
		expect(A.det()).toBe(-1485);
	});

});





describe(' operations that do return matrices', function(){
	it(' adds and subtracts stuff', function(){
		var M = new lg.Matrix([[2,2,2],[3,3,3]]);
		var N = new lg.Matrix([[1,1,1],[1,2,3]]);
		expect(M.add(N).mx).toEqual([[3,3,3],[4,5,6]]);
		expect(M.add(3).mx).toEqual([[5,5,5],[6,6,6]]);
		expect(N.add(M).mx).toEqual([[3,3,3],[4,5,6]]);
		expect(M.sub(N).mx).toEqual([[1,1,1],[2,1,0]]);
		expect(M.sub(1).mx).toEqual([[1,1,1],[2,2,2]]);
	});

	it(' transposes shit', function(){
		var M = new lg.Matrix([[2,2,2],[3,3,3]]);
		var N = M.trans();
		expect(N.mx).toEqual([[2,3],[2,3],[2,3]]);
	});

	it(' multiplies shit', function(){
		var M = new lg.Matrix([[1,2,3],[4,5,6]]);
		var N = new lg.Matrix([[7,8],[9,10],[11,12]])
		expect(M.mult(N).mx).toEqual([[58,64],[139,154]]);
	});

	it(' can return matrices less a particular row and column', function(){
		var A = new lg.Matrix([[1,1,1],[2,2,2],[3,3,3]]);
		expect(A.lessPoint([0,0]).mx).toEqual([[2,2],[3,3]]);
		expect(A.lessPoint([1,1]).mx).toEqual([[1,1],[3,3]]);
		expect(A.lessPoint([0,2]).mx).toEqual([[2,2],[3,3]]);
	});

});



describe(' Vector stuff makes acceptable vectors', function(){
	it( 'makes vectors', function(){
		var A = new lg.Vector([1]);
		var B = new lg.Vector([1,2,3]);
		expect(A.isVector).toBe(true);
		expect(B.isVector).toBe(true);
		expect(A.isMatrix).toBe(true);
		expect(A.mx).toEqual([[1]]);
		expect(B.mx).toEqual([[1],[2],[3]]);
	});
});


describe('vectorCrossProduct', function(){
	it('cross product works in 2d', function(){
		expect(new lg.Vector([1,0]).cross().mx).toEqual([[0],[-1]]);
		expect(new lg.Vector([.5,.5]).cross().mx).toEqual([[.5],[-.5]]);
	})
	it('cross product works in 3d', function(){
		var A = new lg.Vector([1,0,0]);
		var B = new lg.Vector([0,1,0]);
		console.log("B: ",  B)
		var D = new lg.Vector([3,-3,1]);
		var E = new lg.Vector([4,9,2]);
		expect(A.cross(B).mx).toEqual([[0],[0],[1]]);
		expect(D.cross(E).mx).toEqual([[-15],[-2],[39]]);
	});
});

describe('isOrthogonalTo', function(){
		var A = new lg.Vector([1,0,0]);
		var B = new lg.Vector([0,1,0]);
		var C = new lg.Vector([1,1,0]);
		expect(A.isOrthogonalTo(B)).toBe(true);
		expect(B.isOrthogonalTo(A)).toBe(true);
		expect(A.isOrthogonalTo(C)).toBe(false);
});


describe('isOrthonormalTo', function(){
		var A = new lg.Vector([1,0,0]);
		var B = new lg.Vector([0,1,0]);
		var C = new lg.Vector([1,1,0]);
		var D = new lg.Vector([1,-1,0]);
		expect(A.isOrthogonalTo(B)).toBe(true);
		expect(B.isOrthogonalTo(A)).toBe(true);
		expect(A.isOrthonormalTo(B)).toBe(true);
		expect(B.isOrthonormalTo(A)).toBe(true);
		expect(C.isOrthonormalTo(D)).toBe(false);
		expect(D.isOrthonormalTo(C)).toBe(false);
		expect(D.isOrthogonalTo(C)).toBe(true);
		expect(C.isOrthogonalTo(D)).toBe(true);
});


describe(' vector stuff returns acceptable scalars', function(){
	it(' gets the LP norms working', function(){
		var A = new lg.Vector([1]);
		var B = new lg.Vector([1,2]);
		var C = new lg.Vector([1,2,3]);
		expect(A.lpNorm(1)).toBe(1);
		expect(B.lpNorm(1)).toBe(3);
		expect(C.lpNorm(1)).toBe(6);
		expect(A.lpNorm(2)).toBe(1);
		expect(B.lpNorm(2)).toBe(Math.sqrt(5));
		expect(C.lpNorm(2)).toBe(Math.sqrt(14));
		expect(A.euclideanNorm()).toBe(1);
		expect(B.euclideanNorm()).toBe(Math.sqrt(5));
		expect(C.euclideanNorm()).toBe(Math.sqrt(14));
		expect(A.lpNorm(3)).toBe(1);
		expect(B.lpNorm(3)).toBe(Math.pow(9, 1/3));
		expect(C.lpNorm(3)).toBe(Math.pow(36, 1/3));

		expect(A.maxNorm()).toBe(1);
		expect(B.maxNorm()).toBe(2);
		expect(C.maxNorm()).toBe(3);

		expect(A.isUnit()).toBe(true);
		expect(B.isUnit()).toBe(false);

		var D = new lg.Vector([1,3,-5]);
		var E = new lg.Vector([4,-2,-1]);
		expect(D.dot(E)).toBe(3);
		var F = new lg.Vector([1,0,0]);
		var G = new lg.Vector([0,1,0]);
		var H = new lg.Vector([0,0,1]);
		expect(F.dot(G)).toBe(0);
		expect(F.dot(H)).toBe(0);
	});
});


describe(' vector stuff returns acceptable scalars', function(){
	it(' gets the LP norms working', function(){

	});
});
