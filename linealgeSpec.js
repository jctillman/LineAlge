var expect = require('chai').expect;
var lg = require('./linealge.js');

describe('Matrix constructor', function(){

	it(' works while making matrices from complete values', function(){
		var M = new lg.Matrix([[1,1],[1,1]]);
		expect(M.mx).to.eql([[1,1],[1,1]]);
	});

	it(' works while making an array from a vector', function(){
		var M = new lg.Matrix([1,1,1,1]);
		expect(M.mx).to.eql([[1],[1],[1],[1]]);
	});

	it(' works while making an array from a vector', function(){
		var M = new lg.Matrix(1,1,1,1);
		var N = new lg.Matrix(1,2,3);
		expect(M.mx).to.eql([[1],[1],[1],[1]]);
		expect(N.mx).to.eql([[1],[2],[3]]);
	});

});

describe('Alternate matrix construction methods', function(){

	it(' makes zero Matrices', function(){
		var M = lg.zeroMatrix(1);
		var N = lg.zeroMatrix(3);
		expect(M.mx).to.eql([[0]]);
		expect(N.mx).to.eql([[0,0,0],[0,0,0],[0,0,0]]);
	});

	it(' makes diag Matrices', function(){
		var M = lg.diagMatrix([1,2,3]);
		var N = lg.diagMatrix([1,2,3,4]);
		expect(M.mx).to.eql([[1,0,0],[0,2,0],[0,0,3]]);
		expect(N.mx).to.eql([[1,0,0,0],[0,2,0,0],[0,0,3,0],[0,0,0,4]]);
	});

	it(' makes identity Matrices', function(){
		var M = lg.identMatrix(3);
		var N = lg.identMatrix(4);
		expect(M.mx).to.eql([[1,0,0],[0,1,0],[0,0,1]]);
		expect(N.mx).to.eql([[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]);
	});

});





describe('Basic operations that return arrays or array information', function(){
	it(' get rows and individual rows', function(){
		var M = new lg.Matrix([[1,1,1],[2,2,2]]);
		expect(M.rows()).to.eql([[1,1,1],[2,2,2]]);
		expect(M.row(0)).to.eql([1,1,1]);
		expect(M.row(1)).to.eql([2,2,2]);
	});
	it(' get columns and individual columns', function(){
		var M = new lg.Matrix([[1,1,1],[2,2,2]]);
		expect(M.cols()).to.eql([[1,2],[1,2],[1,2]]);
		expect(M.col(0)).to.eql([1,2]);
		expect(M.col(1)).to.eql([1,2]);
	});
	it(' reports dimensions', function(){
		var N = new lg.Matrix([[1,2],[3,4],[5,6]]).dim();
		expect(N.rows).to.eql(3);
		expect(N.cols).to.eql(2);
	});
	it(' gets trace', function(){
		var M = new lg.Matrix([[1,2,3],[4,5,6]]);
		var N = new lg.Matrix([[1,2,3],[4,5,6],[5,6,7]]);
		var O = new lg.Matrix([[1,2,3],[4,5,6],[5,6,7],[9,9,9]]);
		expect(M.trace()).to.eql([1,5]);
		expect(N.trace()).to.eql([1,5,7]);
		expect(O.trace()).to.eql([1,5,7]);
	});
	//it(' can split matrices into sub-arrays')
});

describe('Operations that return bools', function(){
	it(' tests for squares successfully', function(){
		var A = new lg.Matrix([[1,1],[2,2]]);
		var B = new lg.Matrix([[1,1,1],[2,2,2]]);
		expect(A.isSquare()).to.eql(true);
		expect(B.isSquare()).to.eql(false);
	});
	it(' tests to see if two matrices are identical successfully', function(){
		var A = new lg.Matrix([[1,1],[2,2]]);
		var B = new lg.Matrix([[1,1,1],[2,2,2]]);
		var C = new lg.Matrix([[1,1],[2,2]]);
		var D = new lg.Matrix([[1,1,1],[2,2,2]]);
		expect(A.eq(B)).to.eql(false);
		expect(A.eq(C)).to.eql(true);
		expect(D.eq(B)).to.eql(true);
		expect(D.eq(D)).to.eql(true);
	});
	it(' tests to see which matrices are symmetrical', function(){
		var A = new lg.Matrix([[1,2,3],[4,5,6]]);
		var B = new lg.Matrix([[1,2],[2,1]]);
		var C = new lg.Matrix([[1,2,3],[2,3,4],[3,4,5]]);
		var D = new lg.Matrix([[1,2],[3,3]]);
		expect(A.isSymmetric()).to.eql(false);
		expect(B.isSymmetric()).to.eql(true);
		expect(C.isSymmetric()).to.eql(true);
		expect(D.isSymmetric()).to.eql(false);
	});
	it(' tests to see what matrices are orthogonal', function(){
		var A = new lg.Matrix([[1,0],[0,1]]);
		var B = new lg.Matrix([[1,0],[0,-1]]);
		var C = new lg.Matrix([[0,-.8,-.6],[.8,-.36,.48],[.6,.48,-.64]]);
		var D = new lg.Matrix([[0,0,0,1],[0,0,1,0],[1,0,0,0],[0,1,0,0]]); //--
		var E = new lg.Matrix([[0,-.9,-.6],[.8,-.36,.48],[.6,.48,-.64]]);
		var F = new lg.Matrix([[0,0,0,1],[0,0,1,0],[1,0,0,0],[0,1.1,0,0]]);
		expect(A.isOrthogonal()).to.eql(true);
		expect(B.isOrthogonal()).to.eql(true);
		expect(C.isOrthogonal()).to.eql(true);
		expect(D.isOrthogonal()).to.eql(true);
		expect(E.isOrthogonal()).to.eql(false);
		expect(F.isOrthogonal()).to.eql(false);	
	});
});



describe('matrix operations that return scalars', function(){
	it(' returns frobenius', function(){
		var M = new lg.Matrix([[2,2],[2,2]]);
		expect(M.frobenius()).to.eql(4);
	});
	it(' says which determinants do not work correctly', function(){
		var A = new lg.Matrix([[1,1,1],[2,2,2]]);
		expect(A.det()).to.eql(false);
	});
	it(' determinants works for 2 x 2 matrices', function(){
		var A = new lg.Matrix([[1,1],[2,2]]);
		var B = new lg.Matrix([[1,0],[0,1]]);
		var C = new lg.Matrix([[5,4],[4,5]]);
		expect(A.det()).to.eql(0);
		expect(B.det()).to.eql(1);
		expect(C.det()).to.eql(9);
	});
	it(' determinants works for 3 x 3 matrices', function(){
		var A = new lg.Matrix([[6,1,1],[4,-2,5],[2,8,7]])
		var B = new lg.Matrix([[1,5,3],[2,4,7],[4,6,2]])
		expect(A.det()).to.eql(-306);
		expect(B.det()).to.eql(74);
	});
	it(' determinants works for 4 x 4 matrices', function(){
		var A = new lg.Matrix([[2,5,3,5],[14,9,6,7],[4,9,3,2],[3,7,8,6]]);
		expect(A.det()).to.eql(-1485);
	});

});





describe(' operations that do return matrices', function(){
	it(' adds and subtracts stuff', function(){
		var M = new lg.Matrix([[2,2,2],[3,3,3]]);
		var N = new lg.Matrix([[1,1,1],[1,2,3]]);
		expect(M.add(N).mx).to.eql([[3,3,3],[4,5,6]]);
		expect(M.add(3).mx).to.eql([[5,5,5],[6,6,6]]);
		expect(N.add(M).mx).to.eql([[3,3,3],[4,5,6]]);
		expect(M.sub(N).mx).to.eql([[1,1,1],[2,1,0]]);
		expect(M.sub(1).mx).to.eql([[1,1,1],[2,2,2]]);
	});

	it(' transposes shit', function(){
		var M = new lg.Matrix([[2,2,2],[3,3,3]]);
		var N = M.trans();
		expect(N.mx).to.eql([[2,3],[2,3],[2,3]]);
	});

	it(' multiplies shit', function(){
		var M = new lg.Matrix([[1,2,3],[4,5,6]]);
		var N = new lg.Matrix([[7,8],[9,10],[11,12]]);
		expect(M.mult(N).mx).to.eql([[58,64],[139,154]]);
	});


	it(' gives hadamard product', function(){
		var M = new lg.Matrix([[1,2,3],[4,5,6]]);
		var N = new lg.Matrix([[1,1,1],[2,2,2]]);
		expect(M.hadamard(N).mx).to.eql([[1,2,3],[8,10,12]]);
	});



	it(' can return matrices less a particular row and column', function(){
		var A = new lg.Matrix([[1,1,1],[2,2,2],[3,3,3]]);
		expect(A.lessPoint([0,0]).mx).to.eql([[2,2],[3,3]]);
		expect(A.lessPoint([1,1]).mx).to.eql([[1,1],[3,3]]);
		expect(A.lessPoint([0,2]).mx).to.eql([[2,2],[3,3]]);
	});
	it(' returns matrix inverse that work in 1 x 1', function(){
		var A = new lg.Matrix([[1]]);
		var B = new lg.Matrix([[3]]);
		expect(A.inverse().mx).to.eql([[1]]);
		expect(B.inverse().mx).to.eql([[1/3]]);
	});
	it(' returns matrix inverse that work in 2 x 2', function(){
		var A = new lg.Matrix([[4,3],[3,2]]);
		expect(A.inverse().mx).to.eql([[-2,3],[3,-4]]);
	});
	it(' returns matrix inverse that work in 3 x 3', function(){
		var B = new lg.Matrix([[4,3,3],[3,2,3],[3,1,3]]);
		var C = new lg.Matrix([[4.5,0,3],[3,2,3],[9,1,3]]);
		var D = new lg.Matrix([[4.5,3,30],[3,.2,3],[9,1,3]]);
		expect(B.inverse().mult(B).eq(lg.identMatrix(3))).to.eql(true);
		expect(C.inverse().mult(C).eq(lg.identMatrix(3))).to.eql(true);
		expect(D.inverse().mult(D).eq(lg.identMatrix(3))).to.eql(true);
	});
	it(' returns matrix inverse that work in 4 x 4', function(){
		var B = new lg.Matrix([[4,3,3,1],[1,8,10,11],[3,1,3,1],[9,1,9,1]]);
		var C = new lg.Matrix([[4,3,3,1],[3,2,3,1],[3,1,3,1],[1,1,1,10]]);
		var D = new lg.Matrix([[4,3,3,1],[9,9,9,9],[3,1,3,9],[1,1,9,1]]);
		expect(B.inverse().mult(B).eq(lg.identMatrix(4))).to.eql(true);
		expect(C.inverse().mult(C).eq(lg.identMatrix(4))).to.eql(true);
		expect(D.inverse().mult(D).eq(lg.identMatrix(4))).to.eql(true);
	});
});







describe(' Vector stuff makes acceptable vectors', function(){
	it( 'makes vectors', function(){
		var A = new lg.Vector([1]);
		var B = new lg.Vector([1,2,3]);
		expect(A.isVector).to.eql(true);
		expect(B.isVector).to.eql(true);
		expect(A.isMatrix).to.eql(true);
		expect(A.mx).to.eql([[1]]);
		expect(B.mx).to.eql([[1],[2],[3]]);
		var C = new lg.Vector(1,2,3);
		expect(C.mx).to.eql([[1],[2],[3]]);
	});

	it('converts with softmax successfully', function(){
		var A = new lg.Vector([1,1]).softMax();
		var B = new lg.Vector([1,0,1]).softMax();
		var C = new lg.Vector([1,1,1,1]).softMax();
		var D = new lg.Vector([.5,.5,0]).softMax();
		var E = new lg.Vector([1,2,0,.3]).softMax();
		expect(A.eq(new lg.Vector([.5,.5]))).to.eql(true);
		expect(B.col(0).reduce(function(a,b){return a+b;}, 0)).to.eql(1);
		expect(C.eq(new lg.Vector([.25,.25,.25,.25]))).to.eql(true);
		expect(D.col(0).reduce(function(a,b){return a+b;}, 0)).to.eql(1);
	});

});


describe('vectorCrossProduct', function(){
	it('cross product works in 2d', function(){
		expect(new lg.Vector([1,0]).cross().mx).to.eql([[0],[-1]]);
		expect(new lg.Vector([.5,.5]).cross().mx).to.eql([[.5],[-.5]]);
	})
	it('cross product works in 3d', function(){
		var A = new lg.Vector([1,0,0]);
		var B = new lg.Vector([0,1,0]);
		var D = new lg.Vector([3,-3,1]);
		var E = new lg.Vector([4,9,2]);
		expect(A.cross(B).mx).to.eql([[0],[-0],[1]]);
		expect(D.cross(E).mx).to.eql([[-15],[-2],[39]]);
	});
});

describe('isOrthogonalTo', function(){
		var A = new lg.Vector([1,0,0]);
		var B = new lg.Vector([0,1,0]);
		var C = new lg.Vector([1,1,0]);
		expect(A.isOrthogonalTo(B)).to.eql(true);
		expect(B.isOrthogonalTo(A)).to.eql(true);
		expect(A.isOrthogonalTo(C)).to.eql(false);
});


describe('isOrthonormalTo', function(){
		var A = new lg.Vector([1,0,0]);
		var B = new lg.Vector([0,1,0]);
		var C = new lg.Vector([1,1,0]);
		var D = new lg.Vector([1,-1,0]);
		expect(A.isOrthogonalTo(B)).to.eql(true);
		expect(B.isOrthogonalTo(A)).to.eql(true);
		expect(A.isOrthonormalTo(B)).to.eql(true);
		expect(B.isOrthonormalTo(A)).to.eql(true);
		expect(C.isOrthonormalTo(D)).to.eql(false);
		expect(D.isOrthonormalTo(C)).to.eql(false);
		expect(D.isOrthogonalTo(C)).to.eql(true);
		expect(C.isOrthogonalTo(D)).to.eql(true);
});


describe(' vector stuff returns acceptable scalars', function(){
	it(' gets the LP norms working', function(){
		var A = new lg.Vector([1]);
		var B = new lg.Vector([1,2]);
		var C = new lg.Vector([1,2,3]);
		expect(A.lpNorm(1)).to.eql(1);
		expect(B.lpNorm(1)).to.eql(3);
		expect(C.lpNorm(1)).to.eql(6);
		expect(A.lpNorm(2)).to.eql(1);
		expect(B.lpNorm(2)).to.eql(Math.sqrt(5));
		expect(C.lpNorm(2)).to.eql(Math.sqrt(14));
		expect(A.euclideanNorm()).to.eql(1);
		expect(B.euclideanNorm()).to.eql(Math.sqrt(5));
		expect(C.euclideanNorm()).to.eql(Math.sqrt(14));
		expect(A.lpNorm(3)).to.eql(1);
		expect(B.lpNorm(3)).to.eql(Math.pow(9, 1/3));
		expect(C.lpNorm(3)).to.eql(Math.pow(36, 1/3));

		expect(A.maxNorm()).to.eql(1);
		expect(B.maxNorm()).to.eql(2);
		expect(C.maxNorm()).to.eql(3);

		expect(A.isUnit()).to.eql(true);
		expect(B.isUnit()).to.eql(false);

		var D = new lg.Vector([1,3,-5]);
		var E = new lg.Vector([4,-2,-1]);
		expect(D.dot(E)).to.eql(3);
		var F = new lg.Vector([1,0,0]);
		var G = new lg.Vector([0,1,0]);
		var H = new lg.Vector([0,0,1]);
		expect(F.dot(G)).to.eql(0);
		expect(F.dot(H)).to.eql(0);
	});
});


describe(' can do Gauss-Jordan elimination correctly', function(){

	describe(' testing operations performed while doing Gaussian reduction', function(){

		it('Is able to swap rows', function(){

			var A = new lg.Matrix([[1,2,3],[4,5,6],[7,8,9]]);
			var B = new lg.Matrix([[4,5,6],[1,2,3],[7,8,9]]);
			expect(A.rowSwap(0,1).eq(B)).to.eql(true);

			var A = new lg.Matrix([[1,2,3],[4,5,6],[7,8,9]]);
			var B = new lg.Matrix([[7,8,9],[4,5,6],[1,2,3]]);
			expect(A.rowSwap(2,0).eq(B)).to.eql(true);

		});

		it('Is able to multiply rows', function(){

			var A = new lg.Matrix([[1,2,3],[4,5,6],[7,8,9]]);
			var B = new lg.Matrix([[2,4,6],[4,5,6],[7,8,9]]);
			expect(A.rowMult(0,1).eq(A)).to.eql(true);
			expect(A.rowMult(0,2).eq(B)).to.eql(true);

		});

		it('Is able to add rows to each other', function(){

			var A = new lg.Matrix([[1,2,3],[4,5,6],[7,8,9]])
			var B = new lg.Matrix([[5,7,9],[4,5,6],[7,8,9]])
			var C = new lg.Matrix([[8,10,12],[4,5,6],[7,8,9]])
			expect(A.rowAdd(0,1).eq(B)).to.eql(true);
			expect(A.rowAdd(0,2).eq(C)).to.eql(true);

		});

	});

	describe(' testing normal guass Jordan elimination', function(){

		it(' works on a simple 2x2 matrix', function(){

			var A = new lg.Matrix([[3,-2],[6,1]]);
			var B = new lg.Matrix([[1,0],[0,1]]);
			expect(A.gaussJordan().eq(B)).to.eql(true);

		});

		it(' works on a simple 3x3 matrix', function(){

			var A = new lg.Matrix([[0,1,2],[4,5,6],[8,9,10]]);
			var B = new lg.Matrix([[1,0,-1],[0,1,2],[0,0,0]]);

			expect(A.gaussJordan().eq(B)).to.eql(true);

		});

		it(' works on some 4x4 matrixes', function(){

			var A = new lg.Matrix([[1,3,5,8],[1,2,4,-1],[2,0,0,2],[0,1,1,0]]);
			var B = new lg.Matrix([[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]);
			expect(A.gaussJordan().eq(B)).to.eql(true);


			var A = new lg.Matrix([[1,2,3,4],[6,7,8,9],[11,12,13,14],[16,17,18,19]]);
			var B = new lg.Matrix([[1,0,-1,-2],[0,1,2,3],[0,0,0,0],[0,0,0,0]]);
			expect(A.gaussJordan().eq(B)).to.eql(true);

		});

		it (' works on some non-symmetric matrixes', function(){
			var A = new lg.Matrix([[ 1, 0, 3, 1, 2 ], [ 1, 4, 2, 1, 5 ], [ 3, 4, 8, 1, 2 ]]);
			var B = new lg.Matrix([[ 1, 0, 3, 0, -3/2], [0, 1, -1/4, 0, 3/4], [0,0,0,1,7/2]]);
			expect(A.gaussJordan().eq(B)).to.eql(true);

			var A = new lg.Matrix([[ 0, 1, 3, 2], [ 0, 0, 5, 6], [ 1, 5, 1, 5]]);
			var B = new lg.Matrix([[ 1, 0, 0, 59/5], [0, 1, 0, -8/5], [0,0,1,6/5]])
			expect(A.gaussJordan().eq(B)).to.eql(true);

		})

	});


	describe('Testing row equivalency function', function(){

		it('works', function(){

			var A = new lg.Matrix([[ 1, 2],[ 4, 8]]);
			var B = new lg.Matrix([[ 0, 1],[ 1, 2]]);
			expect(A.rowEquivalent(B)).to.eql(false);

			var A = new lg.Matrix([[ 1, 0, 2],[3,-1,1], [5,-1,5]]);
			var B = new lg.Matrix([[ 1, 0, 2],[0, 2,10], [2,0,4]]);
			expect(A.rowEquivalent(B)).to.eql(true);

		});

		it('works with a bunch of randomly generated matrices!!!', function(){

			for(var xxx = 0; xxx < 100; xxx++){

				var randomRow = Math.round(1 + Math.random() * 5);
				var randomCol = Math.round(1 + Math.random() * 5);

				var building = [];
				for(var x = 0; x < randomRow; x++){
					building.push([]);
					for(var y = 0; y < randomCol; y++){
						building[x].push(Math.floor( (Math.random()-0.5)*15 ));
					}
				}
				//console.log(building);
				var A = new lg.Matrix(building);
				var B = new lg.Matrix(building);
				for(var x = 0; x < 3; x++){
					B = B.rowMult(Math.floor( Math.random()*A.mx.length ), Math.floor(Math.random()*2+1) );
					B = B.rowSwap(Math.floor( Math.random()*A.mx.length ), Math.floor( Math.random()*A.mx.length ));
					B = B.rowAdd(Math.floor( Math.random()*A.mx.length ), Math.floor( Math.random()*A.mx.length ));
				}
				//console.log("Original", A.mx);
				//console.log("Reduced", A.gaussJordan().mx);
				//console.log("Original", B.mx);
				//console.log("Reduced", B.gaussJordan().mx);

				expect(A.rowEquivalent(B)).to.eql(true);

			}

		});

	});

});


// describe(' vector stuff returns acceptable scalars', function(){
// 	it(' gets the LP norms working', function(){

// 	});
// });
